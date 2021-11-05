import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { KeyProvider } from "./providers/KeyProvider";
import { ShittyRouterProvider } from "./providers/ShittyRouterProvider";

ReactDOM.render(
  <React.StrictMode>
    <ShittyRouterProvider>
      <KeyProvider>
        <App />
      </KeyProvider>
    </ShittyRouterProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
