import { Button, FileUploader } from "../components";
import { fileToBytes } from "../functions/bytes";
import { encryptData } from "../functions/crypto";
import { useKey } from "../providers/KeyProvider";
import { useShittyRouter } from "../providers/ShittyRouterProvider";

export default function ListFilesView() {
  const { clearKey, key, keyHashHex } = useKey();
  const { setCurrentView } = useShittyRouter();

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
      <FileUploader
        input={{ multiple: true }}
        defaultText="Drag and drop files to upload them"
        dragActiveText="Drop you file here"
        onDrop={async (files) => {
          if (!key) {
            return;
          }
          for (const file of files) {
            const bytes = await fileToBytes(file);
            const encrypted = await encryptData(bytes, key);
            console.log(encrypted);
          }
        }}
      />
    </div>
  );
}
