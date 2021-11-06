import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState, useMemo } from "react";
import { useQueryClient, useQuery } from "react-query";
import { useKey } from "../components/providers/KeyProvider";
import { Button, FileUploader } from "../components/___tiny";
import { fileToBytes } from "../utils/bytes";
import { decryptData, encryptData } from "../utils/crypto";
import { downloadBlob } from "../utils/html";

const Files: NextPage = () => {
  const queryClient = useQueryClient();
  const { clearKey, key, keyHashHex } = useKey();
  const router = useRouter();

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
    <main>
      <Button
        onClick={() => {
          clearKey();
          router.push("/");
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
    </main>
  );
};

export default Files;
