import type { NextPage } from "next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Head from "next/head";
import { useKey } from "../components/providers/KeyProvider";
import {
  Button,
  Card,
  ContentContainer,
  FileUploader,
  Grid,
  GridColumn,
  InputError,
  Loader,
} from "../components/___tiny";
import { fileToBytes, bytesToString } from "../utils/bytes";
import { cryptoKeyToRaw } from "../utils/crypto";
import { downloadText } from "../utils/html";

const Home: NextPage = () => {
  const { setKey, generateKey, creatingKey, clearKey } = useKey();
  const router = useRouter();
  const [uploadError, setUploadError] = useState<string | null>(null);
  return (
    <main className="h-screen w-screen flex items-center justify-center">
      <Head>
        <title>Encrypted store</title>
      </Head>
      <Grid>
        <GridColumn>
          <h1 className="text-2xl">Login</h1>
        </GridColumn>
        <GridColumn>
          <Card>
            <ContentContainer>
              <Grid>
                <GridColumn className="flex justify-center">
                  <Button
                    className="w-full"
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
                    {creatingKey ? <Loader /> : "Generate a secure key"}
                  </Button>
                </GridColumn>
                <GridColumn className="flex justify-center">
                  <p className="text-center">or</p>
                </GridColumn>
                <GridColumn className="flex flex-col gap-1 justify-center">
                  <FileUploader
                    root={{ className: "!w-64" }}
                    onDrop={async (files) => {
                      try {
                        const file = files[0];
                        const b = await fileToBytes(file);
                        const string = bytesToString(b);
                        await setKey(string);
                        setUploadError(null);
                        await router.push("files");
                      } catch (e) {
                        clearKey();
                        setUploadError("Invalid key uploaded");
                      }
                    }}
                    defaultText="Upload your secret key"
                    dragActiveText="Drop your secret key here"
                  />
                  {uploadError && <InputError>{uploadError}</InputError>}
                </GridColumn>
              </Grid>
            </ContentContainer>
          </Card>
        </GridColumn>
      </Grid>
    </main>
  );
};

export default Home;
