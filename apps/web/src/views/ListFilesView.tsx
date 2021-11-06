import { useMemo } from "react";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { Button, FileUploader } from "../components";
import { fileToBytes } from "../functions/bytes";
import { cryptoKeyToRaw, decryptData, encryptData } from "../functions/crypto";
import { downloadBlob } from "../functions/html";
import { useKey } from "../providers/KeyProvider";
import { useShittyRouter } from "../providers/ShittyRouterProvider";

export default function ListFilesView() {
  const queryClient = useQueryClient();
  const { clearKey, key, keyHashHex } = useKey();
  const { setCurrentView } = useShittyRouter();

  const [page, setPage] = useState(0);
  const pageSize = 25;

  const skip = useMemo(() => {
    return page * pageSize;
  }, [page, pageSize]);

  const { data, isLoading, error } = useQuery<ApiResources.FilesResponse>(
    ["filenames", skip, pageSize],
    async () => {
      const res = await fetch(`/api/files?skip=${skip}&take=${pageSize}`, {
        headers: { Identifier: keyHashHex as string },
      });
      return res.json();
    },
    {
      enabled: !!keyHashHex,
      refetchInterval: 1000,
    }
  );

  return (
    <div>
      <Button
        onClick={() => {
          clearKey();
          setCurrentView("login");
        }}
      >
        Logout
      </Button>
      {data?.data.map((f) => (
        <div key={f}>
          <Button
            onClick={async () => {
              if (!keyHashHex || !key) {
                return;
              }
              const res = await fetch(`/api/files/${f}`, {
                headers: { Identifier: keyHashHex },
              });
              const data = await res.arrayBuffer();
              const decrypted = await decryptData(data, key);
              const b = new Blob([decrypted]);
              downloadBlob(f, b);
            }}
          >
            {f}
          </Button>
          <a href={`/api/files/${f}`} download>
            {f}
          </a>
        </div>
      ))}
      <FileUploader
        input={{ multiple: true }}
        defaultText="Drag and drop files to upload them"
        dragActiveText="Drop you file here"
        onDrop={async (files) => {
          if (!key || !keyHashHex) {
            return;
          }
          for (const file of files) {
            const bytes = await fileToBytes(file);
            const encrypted = await encryptData(bytes, key);
            await fetch("/api/files/" + file.name, {
              method: "POST",
              body: encrypted,
              headers: {
                "Content-Type": "application/octet-stream",
                Identifier: keyHashHex,
              },
            });
          }
          queryClient.invalidateQueries("filenames");
        }}
      />
    </div>
  );
}
