import { Lightbulb, ListChecks, ScanSearch, XCircle } from "lucide-react";

const TIPS = [
  {
    icon: ListChecks,
    title: "Read the Question First",
    body: "Skim the question before the passages so you know what to look for — usually how one author would react to the other's claim.",
  },
  {
    icon: ScanSearch,
    title: "Context is Key",
    body: "Identify each author's main claim and the reasons behind it. Note exactly where the two passages disagree.",
  },
  {
    icon: XCircle,
    title: "Eliminate Wrong Answers",
    body: "Cross out options that go beyond what an author says, contradict the passage, or address a point neither author raises.",
  },
];

export function TipsPanel() {
  return (
    <aside className="sheet flex h-full flex-col overflow-hidden" aria-label="Reading comprehension tips">
      <div className="flex items-center gap-2 border-b border-border px-5 py-4">
        <Lightbulb className="size-4 text-warning" aria-hidden />
        <h2 className="font-serif text-lg font-semibold">Reading Comprehension Tips</h2>
      </div>
      <ul className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        {TIPS.map((tip, i) => (
          <li key={tip.title} className="flex gap-3">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary-soft text-primary">
              <tip.icon className="size-4" aria-hidden />
            </div>
            <div>
              <p className="text-sm font-semibold">
                <span className="mr-1.5 font-mono text-xs text-muted-foreground">{i + 1}.</span>
                {tip.title}
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{tip.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
