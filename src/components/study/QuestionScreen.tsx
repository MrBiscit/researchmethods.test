import { useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowRight, Loader2, RotateCcw, SkipForward } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { OptionKey, StudyStep } from "@/lib/study-content";
import { scoreResponse } from "@/lib/scoring";
import { saveResult, type GroupType } from "@/lib/study-api";
import { AssistantPanel } from "./AssistantPanel";
import { TipsPanel } from "./TipsPanel";

const KEYS: OptionKey[] = ["A", "B", "C", "D"];

const PHASE_LABEL = { pretest: "Pretest", learning: "Learning", test: "Test" } as const;

export function QuestionScreen({
  step,
  group,
  participantId,
  onDone,
}: {
  step: StudyStep;
  group: GroupType;
  participantId: string;
  onDone: () => void;
}) {
  const { problem, phase, index } = step;
  const startRef = useRef<number>(0);
  const [selected, setSelected] = useState<OptionKey | null>(null);
  const [saving, setSaving] = useState<"submit" | "skip" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pendingRef = useRef<Parameters<typeof saveResult>[0] | null>(null);

  useEffect(() => {
    startRef.current = performance.now();
    window.scrollTo({ top: 0 });
  }, [problem.id]);

  const showSidebar = phase === "learning";

  async function persist(payload: Parameters<typeof saveResult>[0]) {
    setError(null);
    try {
      await saveResult(payload);
      pendingRef.current = null;
      onDone();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save your response.");
    } finally {
      setSaving(null);
    }
  }

  function finish(action: "submit" | "skip") {
    if (saving) return;
    // Freeze the measured response once; retries re-send the same outcome.
    if (!pendingRef.current) {
      const outcome = scoreResponse({
        action,
        selected,
        correct: problem.correct,
        elapsedMs: performance.now() - startRef.current,
      });
      pendingRef.current = { participantId, phase, problemIndex: index, outcome };
    }
    setSaving(action);
    void persist(pendingRef.current);
  }

  const locked = saving !== null || pendingRef.current !== null;

  return (
    <div
      className={cn(
        "mx-auto grid max-w-[1440px] gap-6 px-4 py-6 sm:px-6 lg:py-8",
        showSidebar && "lg:grid-cols-[minmax(0,1fr)_380px]",
      )}
    >
      <div className={cn("min-w-0 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500", !showSidebar && "mx-auto w-full max-w-5xl")}>
        <div className="flex items-baseline justify-between gap-4">
          <p className="eyebrow">
            {PHASE_LABEL[phase]} · Problem {index + 1}
          </p>
          <p className="text-xs text-muted-foreground">{problem.topic}</p>
        </div>

        <section className="grid gap-4 md:grid-cols-2" aria-label="Passages">
          <Passage label="Passage A" paragraphs={problem.passageA} />
          <Passage label="Passage B" paragraphs={problem.passageB} />
        </section>

        <section className="sheet p-5 sm:p-6" aria-labelledby={`q-${problem.id}`}>
          <h2 id={`q-${problem.id}`} className="font-serif text-lg font-semibold leading-snug sm:text-xl">
            {problem.question}
          </h2>

          <div role="radiogroup" aria-labelledby={`q-${problem.id}`} className="mt-5 space-y-2.5">
            {KEYS.map((k) => {
              const active = selected === k;
              return (
                <button
                  key={k}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  disabled={locked}
                  onClick={() => setSelected(k)}
                  className={cn(
                    "group flex w-full items-start gap-3.5 rounded-lg border px-4 py-3 text-left transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? "border-primary bg-primary-soft shadow-lift"
                      : "border-border bg-paper hover:border-primary/40 hover:bg-accent/40",
                    locked && "cursor-default opacity-80",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs font-semibold transition-colors",
                      active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input text-muted-foreground group-hover:border-primary/50",
                    )}
                  >
                    {k}
                  </span>
                  <span className="pt-0.5 text-[0.95rem] leading-relaxed">{problem.options[k]}</span>
                </button>
              );
            })}
          </div>

          {error && (
            <div className="mt-5 flex flex-wrap items-center gap-3 rounded-md border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive" role="alert">
              <AlertCircle className="size-4 shrink-0" aria-hidden />
              <span className="flex-1">Your response couldn't be saved: {error}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (!pendingRef.current) return;
                  setSaving("submit");
                  void persist(pendingRef.current);
                }}
              >
                <RotateCcw aria-hidden /> Retry
              </Button>
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Button variant="ghost" onClick={() => finish("skip")} disabled={locked} className="text-muted-foreground">
              {saving === "skip" ? <Loader2 className="animate-spin" aria-hidden /> : <SkipForward aria-hidden />}
              Skip
            </Button>
            <Button size="lg" onClick={() => finish("submit")} disabled={!selected || locked} className="sm:min-w-40">
              {saving === "submit" ? <Loader2 className="animate-spin" aria-hidden /> : null}
              Submit answer
              {saving !== "submit" && <ArrowRight aria-hidden />}
            </Button>
          </div>
        </section>
      </div>

      {showSidebar && (
        <div className="lg:sticky lg:top-[4.5rem] lg:h-[calc(100vh-6rem)] animate-in fade-in slide-in-from-right-4 duration-500">
          {group === "ai_assisted" ? <AssistantPanel key={problem.id} problem={problem} /> : <TipsPanel />}
        </div>
      )}
    </div>
  );
}

function Passage({ label, paragraphs }: { label: string; paragraphs: string[] }) {
  return (
    <article className="sheet p-5 sm:p-6">
      <p className="eyebrow mb-3 border-b border-rule pb-2">{label}</p>
      <div className="prose-passage">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </article>
  );
}
