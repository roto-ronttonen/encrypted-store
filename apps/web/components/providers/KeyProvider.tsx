import { useRouter } from "next/router";
import React, { useState, useContext } from "react";
import { useEffect } from "react";
import { digestMessage, rawToCryptoKey } from "../../utils/crypto";

type KeyContextValue = {
  key: CryptoKey | null;
  keyHashHex: string | null;
  generateKey: () => Promise<CryptoKey | undefined>;
  setKey: (key: string) => Promise<void>;
  creatingKey: boolean;
  clearKey: () => void;
  loggedIn: boolean;
};

const KeyContext = React.createContext<KeyContextValue>(null as any);

export type KeyProvideProps = {
  children?: React.ReactNode;
};

export function KeyProvider({ children }: KeyProvideProps) {
  // Used as encryption secret key
  const [key, _setKey] = useState<CryptoKey | null>(null);
  const [keyHashHex, setKeyHashHex] = useState<string | null>(null);

  const [creatingKey, setCreatingKey] = useState(false);

  const generateKey = async () => {
    if (!creatingKey) {
      setCreatingKey(true);
      const k = await window.crypto.subtle.generateKey(
        {
          name: "AES-GCM",
          length: 256,
        },
        true,
        ["encrypt", "decrypt"]
      );

      setCreatingKey(false);
      return k;
    }
  };

  const setKey = async (rawKey: string) => {
    if (!creatingKey) {
      setCreatingKey(true);
      const key = await rawToCryptoKey(rawKey);
      _setKey(key);
      const hex = await digestMessage(rawKey);
      setKeyHashHex(hex);
      setCreatingKey(false);
    }
  };

  const clearKey = () => {
    if (!creatingKey) {
      _setKey(null);
      setKeyHashHex(null);
    }
  };

  const loggedIn = !!key && !!keyHashHex;

  return (
    <KeyContext.Provider
      value={{
        key,
        keyHashHex,
        generateKey,
        creatingKey,
        setKey,
        clearKey,
        loggedIn,
      }}
    >
      {children}
    </KeyContext.Provider>
  );
}

export function useKey() {
  return useContext(KeyContext);
}

export function useRequireLogin() {
  const { loggedIn } = useKey();

  const router = useRouter();

  useEffect(() => {
    if (process.browser) {
      if (!loggedIn) {
        router.push("/");
      }
    }
  });
}
