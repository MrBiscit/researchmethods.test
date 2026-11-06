import { CheckCircle2, DatabaseZap } from "lucide-react";

export function CompletionScreen({ name, total, onReset }: { name: string; total: number; onReset: () => void }) {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-xl items-center px-4 py-12 sm:px-6">
      <div className="sheet w-full p-8 text-center shadow-lift animate-in fade-in zoom-in-95 duration-700 sm:p-10">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-soft text-success">
          <CheckCircle2 className="size-7" aria-hidden />
        </div>
        <h1 className="mt-5 font-serif text-3xl font-semibold">Thank you, {name}.</h1>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted-foreground">
          You've completed the study. Your participation helps us understand how people read, reason, and
          learn.
        </p>
        <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success-soft px-4 py-2 text-sm font-medium text-success">
          <DatabaseZap className="size-4" aria-hidden />
          All {total} responses were saved successfully.
        </div>
        <p className="mt-6 text-xs text-muted-foreground">
          You may now close this window.{" "}
          <button type="button" onClick={onReset} className="underline underline-offset-2 hover:text-foreground">
            Start a new session
          </button>
        </p>
      </div>
    </div>
  );
}
