/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Projet Supabase de la synchronisation (sinon : valeurs de src/data/synchro.ts). */
  readonly PUBLIC_SUPABASE_URL?: string;
  readonly PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
}

declare module "sql.js" {
  const initSqlJs: (config?: { locateFile?: (fichier: string) => string }) => Promise<unknown>;
  export default initSqlJs;
}

/** Variables d'environnement du serveur (fonctions Vercel) : ANTHROPIC_API_KEY, IA_EMAILS_AUTORISES. */
declare const process: { env: Record<string, string | undefined> };
