import React, { useEffect, useContext, useState } from "react";

import StaticConfig from "../../utils/config";
import { useKey } from "./KeyProvider";

export type ApiClientContextValue = ApiClient | null;

const ApiClientContext = React.createContext<ApiClientContextValue>(null);

export type ApiClientProviderProps = {
  children: React.ReactNode;
};

export function ApiClientProvider({ children }: ApiClientProviderProps) {
  const { keyHashHex } = useKey();
  const [client, setClient] = useState<ApiClient | null>(null);

  useEffect(() => {
    if (keyHashHex) {
      setClient(new ApiClient(keyHashHex));
    } else {
      setClient(null);
    }
  }, [keyHashHex]);

  return (
    <ApiClientContext.Provider value={client}>
      {children}
    </ApiClientContext.Provider>
  );
}

export function useApiClient() {
  return useContext(ApiClientContext);
}

export class ApiClient {
  private apiHost = StaticConfig.browserIsDev() ? `http://localhost:5000` : "";

  private _keyHashHex!: string;
  constructor(keyHashHex: string) {
    this._keyHashHex = keyHashHex;
  }

  async listFiles(skip: number, pageSize: number) {
    const res = await fetch(
      `${this.apiHost}/api/files?skip=${skip}&take=${pageSize}`,
      {
        headers: { Identifier: this._keyHashHex },
      }
    );
    return res.json();
  }

  async uploadFile(fileName: string, data: Uint8Array) {
    await fetch(`${this.apiHost}/api/files/${fileName}`, {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "application/octet-stream",
        Identifier: this._keyHashHex,
      },
    });
  }
}
