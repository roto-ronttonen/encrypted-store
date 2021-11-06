import { useState } from "react";
import {
  Button,
  FileUploader,
  InputError,
  Label,
  Loader,
  TextInput,
} from "../components";
import { bytesToString, fileToBytes } from "../functions/bytes";
import { cryptoKeyToRaw } from "../functions/crypto";
import { downloadText } from "../functions/html";
import { useKey } from "../providers/KeyProvider";
import { useShittyRouter } from "../providers/ShittyRouterProvider";

export default function LoginView() {
  const { setCurrentView } = useShittyRouter();
  const { setKey, generateKey, creatingKey } = useKey();

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
          setCurrentView("list-files");
        }}
        defaultText="Drag and drop or click here to login with your secret key"
        dragActiveText="Drop your secret key here"
      />
    </main>
  );
}
