/// <reference types="vite/client" />

interface ImportMetaEnv {
  VITE_PUBLIC_WALLET_CONNECT_PROJECT_ID?: string;
  VITE_PUBLIC_PORTAL_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
