/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** "1" pour activer la correction IA des rédactions (nécessite la route /api/corriger). */
  readonly PUBLIC_CORRECTION_IA?: string;
}

declare module "sql.js" {
  const initSqlJs: (config?: { locateFile?: (fichier: string) => string }) => Promise<unknown>;
  export default initSqlJs;
}
