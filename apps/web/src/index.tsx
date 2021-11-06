import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { KeyProvider } from "./providers/KeyProvider";
import { ShittyRouterProvider } from "./providers/ShittyRouterProvider";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <ShittyRouterProvider>
      <KeyProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </KeyProvider>
    </ShittyRouterProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
