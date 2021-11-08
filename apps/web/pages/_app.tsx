import "../styles/globals.css";
import type { AppProps } from "next/app";
import { KeyProvider } from "../components/providers/KeyProvider";
import { QueryClient, QueryClientProvider } from "react-query";
import { ApiClientProvider } from "../components/providers/ApiClientProvider";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <KeyProvider>
      <ApiClientProvider>
        <QueryClientProvider client={queryClient}>
          <Component {...pageProps} />
        </QueryClientProvider>
      </ApiClientProvider>
    </KeyProvider>
  );
}

export default MyApp;
