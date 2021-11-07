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
  Loader,
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
  const pageSize = 50;

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
    <main className="flex flex-col min-w-0 items-center justify-center">
      <div className="w-full min-w-0 border-b flex justify-end items-center border-solid border-gray-300 p-4 fixed top-0 left-0 right-0 z-20 bg-white">
        <button
          onClick={() => {
            clearKey();
            router.push("/");
          }}
        >
          <IoLogOutOutline size={20} />
        </button>
      </div>

      <ContentContainer className="flex min-w-0 w-full flex-col gap-6 mt-14">
        <h1 className="text-2xl">Files</h1>
        <div className="inline-flex">
          <FileUploader
            input={{ multiple: true }}
            defaultText="Upload files"
            dragActiveText="Drop you files here"
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
        {isLoading ? (
          <div className="flex flex-grow items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="flex flex-col gap-6 justify-between flex-grow pb-8">
            {data && (
              <>
                <div className="flex flex-wrap gap-4">
                  {data?.data.map((f) => (
                    <Card key={f} className="inline-flex max-w-[100%]">
                      <button
                        className="w-full"
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
                        <ContentContainer className="flex flex-col justify-between h-full w-full">
                          <h4 className="break-words w-full">{f}</h4>
                        </ContentContainer>
                      </button>
                    </Card>
                  ))}
                </div>
                <Paginator
                  className="fixed right-4 bottom-4 z-20 shadow rounded p-1 bg-white"
                  currentPage={page}
                  numPages={Math.ceil(data.totalCount / pageSize)}
                  onPageClick={(p) => setPage(p)}
                />
              </>
            )}
          </div>
        )}
      </ContentContainer>
    </main>
  );
};

export default Files;
