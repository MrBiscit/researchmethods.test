import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PHASE_COUNTS, type Phase } from "@/lib/study-content";

const PHASES: { key: Phase; label: string }[] = [
  { key: "pretest", label: "Pretest" },
  { key: "learning", label: "Learning" },
  { key: "test", label: "Test" },
];

const ORDER: Record<Phase, number> = { pretest: 0, learning: 1, test: 2 };

/** current: the phase in progress and how many problems in it are complete. done = whole study done. */
export function ProgressSteps({
  phase,
  completedInPhase,
  done = false,
}: {
  phase: Phase;
  completedInPhase: number;
  done?: boolean;
}) {
  return (
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2" aria-label="Study progress">
      {PHASES.map((p, i) => {
        const total = PHASE_COUNTS[p.key];
        const state = done || ORDER[p.key] < ORDER[phase] ? "done" : p.key === phase ? "current" : "upcoming";
        const count = state === "done" ? total : state === "current" ? completedInPhase : 0;
        const position = state === "current" ? Math.min(completedInPhase + 1, total) : count;
        return (
          <li key={p.key} className="flex items-center gap-1.5">
            <div
              className={cn(
                "flex items-center gap-2 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                state === "current" && "border-primary/40 bg-primary-soft text-accent-foreground",
                state === "done" && "border-border bg-paper text-muted-foreground",
                state === "upcoming" && "border-dashed border-border text-muted-foreground/70",
              )}
              aria-current={state === "current" ? "step" : undefined}
            >
              {state === "done" ? (
                <Check className="size-3.5 text-success" aria-hidden />
              ) : (
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    state === "current" ? "bg-primary" : "bg-muted-foreground/40",
                  )}
                  aria-hidden
                />
              )}
              <span>{p.label}</span>
              {total > 1 && (
                <span className="font-mono text-[0.6875rem] tabular-nums opacity-80">
                  [{position}/{total}]
                </span>
              )}
              {state === "current" && total > 1 && (
                <span className="hidden items-center gap-0.5 sm:flex" aria-hidden>
                  {Array.from({ length: total }).map((_, j) => (
                    <span
                      key={j}
                      className={cn(
                        "h-1 w-3 rounded-full",
                        j < completedInPhase ? "bg-primary" : j === completedInPhase ? "bg-primary/40" : "bg-border",
                      )}
                    />
                  ))}
                </span>
              )}
            </div>
            {i < PHASES.length - 1 && <ChevronRight className="size-3.5 text-muted-foreground/50" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
