import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState, useMemo } from "react";
import { useQueryClient, useQuery } from "react-query";
import { useKey, useRequireLogin } from "../components/providers/KeyProvider";
import {
  Button,
  Card,
  ContentContainer,
  FileUploader,
  Paginator,
} from "../components/___tiny";
import { fileToBytes } from "../utils/bytes";
import { decryptData, encryptData } from "../utils/crypto";
import { downloadBlob } from "../utils/html";
import { IoLogOutOutline } from "react-icons/io5";

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

  useRequireLogin();

  return (
    <main className="w-screen h-screen flex items-center justify-center">
      <button
        className="absolute top-2 right-2 p-4"
        onClick={() => {
          clearKey();
          router.push("/");
        }}
      >
        <IoLogOutOutline size={20} />
      </button>
      <ContentContainer className="w-screen h-screen flex flex-col">
        <div className="flex flex-wrap flex-grow">
          {data?.data.map((f) => (
            <Card key={f} className="h-32 w-32">
              <ContentContainer className="flex flex-col">
                <h4>{f}</h4>
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
                  Download
                </Button>
              </ContentContainer>
            </Card>
          ))}
        </div>
        <div className="flex justify-between">
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
          {data && (
            <Paginator
              currentPage={page}
              numPages={Math.ceil(data.totalCount / pageSize)}
              onPageClick={(p) => setPage(p)}
            />
          )}
        </div>
      </ContentContainer>
    </main>
  );
};

export default Files;
