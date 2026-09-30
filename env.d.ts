/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LEGAL_NAME?: string
  readonly VITE_LEGAL_STREET?: string
  readonly VITE_LEGAL_POSTAL_CODE?: string
  readonly VITE_LEGAL_CITY?: string
  readonly VITE_LEGAL_COUNTRY?: string
  readonly VITE_LEGAL_EMAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
