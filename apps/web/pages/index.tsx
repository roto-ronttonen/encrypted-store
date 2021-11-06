import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { useKey } from "../components/providers/KeyProvider";
import { Button, FileUploader, Loader } from "../components/___tiny";
import { fileToBytes, bytesToString } from "../utils/bytes";
import { cryptoKeyToRaw } from "../utils/crypto";
import { downloadText } from "../utils/html";

const Home: NextPage = () => {
  const { setKey, generateKey, creatingKey } = useKey();
  const router = useRouter();
  return (
    <main>
      <Button
        onClick={async () => {
          const key = await generateKey();
          if (key) {
            const rawKey = await cryptoKeyToRaw(key);
            if (rawKey) {
              // Download key for user
              const asTxt = JSON.stringify(rawKey);
              downloadText(asTxt);
            }
          }
        }}
        type="button"
        disabled={creatingKey}
      >
        {creatingKey ? <Loader /> : "Generate and download a  secure key"}
      </Button>
      <FileUploader
        onDrop={async (files) => {
          const file = files[0];
          const b = await fileToBytes(file);
          const string = bytesToString(b);
          await setKey(string);
          router.push("files");
        }}
        defaultText="Drag and drop or click here to login with your secret key"
        dragActiveText="Drop your secret key here"
      />
    </main>
  );
};

export default Home;
