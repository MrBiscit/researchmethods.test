## Backend

- **Database:** your own Supabase project (Postgres). The schema lives in `supabase/migrations/`; add new changes as new timestamped migration files there. `src/integrations/supabase/types.ts` mirrors the schema; regenerate it with `supabase gen types typescript --project-id <ref> > src/integrations/supabase/types.ts` after schema changes.
- **AI assistant:** calls the Gemini API directly from the server function in `src/lib/assistant.functions.ts`, using `GEMINI_API_KEY` (optionally `GEMINI_MODEL`). Keep the key server-side only: never prefix it with `VITE_` and never import it in browser code.
- **Secrets:** keep them in `.env` locally and in your host's environment settings in production. Only `.env.example` is committed.

## Project rules

- Participants register only through the `register_participant` database function (permuted blocks of 4); the browser has no direct read access to `participants`, so assignment can't be inspected or tampered with.
- `test_results` accepts inserts from the browser but no reads; the insert policy checks the participant via the `participant_exists` security-definer function because anon cannot select `participants`.
- Scoring and the under-5-seconds skip rule live in `src/lib/scoring.ts` (covered by `scoring.test.ts`); keep grading logic there, not in components.
- Study problems live in `src/lib/study-content.ts`; the AI assistant server function looks problems up by id so the client can't inject arbitrary context.
