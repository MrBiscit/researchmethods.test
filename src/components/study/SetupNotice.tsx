import { TriangleAlert } from "lucide-react";

export function SetupNotice({ missing }: { missing: string[] }) {
  return (
    <div className="border-b border-warning/40 bg-warning-soft" role="alert">
      <div className="mx-auto flex max-w-5xl gap-3 px-4 py-4 text-sm text-warning-foreground sm:px-6">
        <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
        <div className="space-y-1.5">
          <p className="font-semibold">Database connection not configured</p>
          <p>
            Responses can't be saved until the following settings are available:{" "}
            {missing.map((m, i) => (
              <span key={m}>
                <code className="rounded bg-paper/70 px-1 py-0.5 font-mono text-xs">{m}</code>
                {i < missing.length - 1 ? ", " : ""}
              </span>
            ))}
            .
          </p>
          <ol className="list-decimal space-y-0.5 pl-5">
            <li>Copy <code className="font-mono text-xs">.env.example</code> to <code className="font-mono text-xs">.env</code> and fill in your Supabase project URL and publishable key.</li>
            <li>Run <code className="font-mono text-xs">supabase/migrations/20260101000000_init_study_schema.sql</code> in the Supabase SQL Editor so the tables <code className="font-mono text-xs">participants</code> and <code className="font-mono text-xs">test_results</code> exist.</li>
            <li>Restart the dev server (or rebuild) so the new settings are picked up, then reload this page.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
