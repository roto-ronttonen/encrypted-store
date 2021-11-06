import "../styles/globals.css";
import type { AppProps } from "next/app";
import { KeyProvider } from "../components/providers/KeyProvider";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <KeyProvider>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </KeyProvider>
  );
}

export default MyApp;
