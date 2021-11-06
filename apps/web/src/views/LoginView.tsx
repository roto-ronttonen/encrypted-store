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
              const elem = document.createElement("a");
              elem.setAttribute(
                "href",
                "data:text/plain;charset=utf-8," + asTxt
              );
              elem.setAttribute("download", "secret_key.txt");
              elem.style.display = "none";
              document.body.append(elem);
              elem.click();
              document.body.removeChild(elem);
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
