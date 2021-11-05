import { nanoid } from "nanoid";
import React, { useState, useContext } from "react";

type KeyContextValue = {
  key: string | null;
  keyHashHex: string | null;
  generateKey: () => string | undefined;
  setKey: (key: string) => Promise<void>;
  creatingKey: boolean;
  clearKey: () => void;
};

const KeyContext = React.createContext<KeyContextValue>(null as any);

export type KeyProvideProps = {
  children?: React.ReactNode;
};

export function KeyProvider({ children }: KeyProvideProps) {
  // Used as encryption secret key
  const [key, _setKey] = useState<string | null>(null);
  const [keyHashHex, setKeyHashHex] = useState<string | null>(null);

  const [creatingKey, setCreatingKey] = useState(false);

  const generateKey = () => {
    if (!creatingKey) {
      setCreatingKey(true);
      const k = nanoid(128);
      setCreatingKey(false);
      return k;
    }
  };

  const setKey = async (key: string) => {
    if (!creatingKey && key.length >= 128) {
      setCreatingKey(true);
      _setKey(key);
      const hex = await digestMessage(key);
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

  return (
    <KeyContext.Provider
      value={{ key, keyHashHex, generateKey, creatingKey, setKey, clearKey }}
    >
      {children}
    </KeyContext.Provider>
  );
}

export function useKey() {
  return useContext(KeyContext);
}

async function digestMessage(message: string) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-512", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}
