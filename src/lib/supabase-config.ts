// Checks that the backend connection settings are present in the browser build.
export function getMissingBackendConfig(): string[] {
  const missing: string[] = [];
  if (!import.meta.env["VITE_SUPABASE_URL"]) missing.push("VITE_SUPABASE_URL");
  if (!import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"]) missing.push("VITE_SUPABASE_PUBLISHABLE_KEY");
  return missing;
}

export function isBackendConfigured(): boolean {
  return getMissingBackendConfig().length === 0;
}
