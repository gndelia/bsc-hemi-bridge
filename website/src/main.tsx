import { EvmWalletContext } from "contexts/walletsContext.tsx";
import "react-loading-skeleton/dist/skeleton.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./styles.css";
import { App } from "./app.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EvmWalletContext>
      <App />
    </EvmWalletContext>
  </StrictMode>,
);
