// Synchronisation de la progression entre appareils, avec un projet Supabase (facultatif).
// Ces deux valeurs sont PUBLIQUES par conception : la « publishable key » est faite pour être lue dans le navigateur,
// et la table n'est accessible qu'au compte connecté (règles RLS de supabase/schema.sql).
// Ne jamais mettre ici la clé secrète ni la clé « service_role ».
// Laissées vides, la synchronisation est simplement désactivée. Les variables d'environnement
// PUBLIC_SUPABASE_URL et PUBLIC_SUPABASE_PUBLISHABLE_KEY, si elles existent, ont la priorité (tests).

export const SUPABASE = {
  url: import.meta.env.PUBLIC_SUPABASE_URL || "https://enqyziipmjuzkqelnxdc.supabase.co",
  cle: import.meta.env.PUBLIC_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_fRtprTSMqaycfBoDBi-Lfw_dRd5x1Cz",
};

export const synchroConfiguree = Boolean(SUPABASE.url && SUPABASE.cle);
