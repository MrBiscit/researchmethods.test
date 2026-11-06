// Browser Supabase client for your own Supabase project.
// Configure with VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY (see .env.example).
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith("sb_publishable_") || value.startsWith("sb_secret_");
}

// New-style Supabase API keys are opaque strings, not bearer JWTs, so they must only be
// sent in the `apikey` header and never as `Authorization: Bearer`.
function createSupabaseFetch(supabaseKey: string): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    if (isNewSupabaseApiKey(supabaseKey) && headers.get("Authorization") === `Bearer ${supabaseKey}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", supabaseKey);
    return fetch(input, { ...init, headers });
  };
}

function createSupabaseClient() {
  // import.meta.env is replaced at build time in the browser; process.env covers SSR.
  const url =
    import.meta.env["VITE_SUPABASE_URL"] ||
    (typeof process !== "undefined" ? process.env["SUPABASE_URL"] : undefined);
  const key =
    import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ||
    (typeof process !== "undefined" ? process.env["SUPABASE_PUBLISHABLE_KEY"] : undefined);

  if (!url || !key) {
    const missing = [...(!url ? ["VITE_SUPABASE_URL"] : []), ...(!key ? ["VITE_SUPABASE_PUBLISHABLE_KEY"] : [])];
    const message = `Missing Supabase environment variable(s): ${missing.join(", ")}. Copy .env.example to .env and fill them in.`;
    console.error(`[Supabase] ${message}`);
    throw new Error(message);
  }

  // Participants are anonymous (no sign-in), so there is no session to persist.
  return createClient<Database>(url, key, {
    global: { fetch: createSupabaseFetch(key) },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

let _supabase: ReturnType<typeof createSupabaseClient> | undefined;

// Import like this:  import { supabase } from "@/integrations/supabase/client";
// Created lazily so a missing config shows the setup notice instead of crashing at import time.
export const supabase = new Proxy({} as ReturnType<typeof createSupabaseClient>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
