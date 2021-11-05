import { useState } from "react";
import { Button, InputError, Label, Loader, TextInput } from "../components";
import { useKey } from "../providers/KeyProvider";
import { useShittyRouter } from "../providers/ShittyRouterProvider";

export default function LoginView() {
  const { setCurrentView } = useShittyRouter();
  const { setKey, generateKey, creatingKey } = useKey();

  const [passwordValue, setPasswordValue] = useState("");

  const [passwordError, setPasswordError] = useState<string | null>(null);

  return (
    <main>
      <Button
        onClick={async () => {
          const password = generateKey();
          if (password) {
            setPasswordValue(password);
          }
        }}
        type="button"
        disabled={creatingKey}
      >
        {creatingKey ? <Loader /> : "Generate secure password"}
      </Button>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (creatingKey) {
            return;
          }
          if (passwordValue.length < 128) {
            setPasswordError("Password must be atleast 128 characters");
          } else {
            setPasswordError(null);
            await setKey(passwordValue);
            setCurrentView("list-files");
          }
        }}
      >
        <Label>Password</Label>
        <TextInput
          disabled={creatingKey}
          placeholder="Password should be 128 characters long"
          value={passwordValue}
          onChange={(e) => setPasswordValue(e.target.value)}
        />
        {passwordError && <InputError>{passwordError}</InputError>}
        <Button type="submit" disabled={creatingKey}>
          {creatingKey ? <Loader /> : "Login"}
        </Button>
      </form>
    </main>
  );
}
