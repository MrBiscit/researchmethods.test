import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GroupType } from "@/lib/study-api";

// Condition instructions shown after the practice round (Liu et al., Appendix C.1).
// The original named "ChatGPT"; this replication's assistant is Gemini, so it says "the AI assistant".
const COPY: Record<GroupType, { title: string; paragraphs: string[] }> = {
  control: {
    title: "Self-learning condition",
    paragraphs: [
      "You have been randomly assigned to the self-learning condition. In this condition, we want you to work through the reading comprehension problems on your own. You will have access to a reference panel with tips on how to solve reading comprehension questions. We highly encourage you to take your time to work through the solutions.",
      "For some problems, the reference panel will not be available.",
      "Please don’t use AI tools or Google to solve the problems.",
    ],
  },
  ai_assisted: {
    title: "AI-assisted learning condition",
    paragraphs: [
      "You have been randomly assigned to the AI-assisted learning condition. In this condition, you will have access to an AI assistant to help you solve problems. We encourage you to use the AI to help you work through the problems. You can use the AI however you like – feel free to ask it for hints, answers, or solutions.",
      "For some problems, the AI assistant won’t be available. When the AI assistant isn’t available, please don’t use other AI tools or Google.",
    ],
  },
};

export function PhaseIntro({ group, onContinue }: { group: GroupType; onContinue: () => void }) {
  const c = COPY[group];
  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-2xl items-center px-4 py-12 sm:px-6">
      <div className="sheet w-full p-8 animate-in fade-in zoom-in-95 duration-500 sm:p-10">
        <p className="eyebrow">Instructions</p>
        <h1 className="mt-3 font-serif text-3xl font-semibold">{c.title}</h1>
        <div className="mt-5 space-y-4 leading-relaxed text-foreground/90">
          {c.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
          <p className="rounded-md border border-border bg-muted/60 px-4 py-3 text-sm">
            <strong className="font-semibold">Important:</strong> Your payment does NOT depend on how many
            problems you answer correctly.
          </p>
        </div>
        <div className="mt-8 flex justify-end">
          <Button size="lg" className="min-w-40" onClick={onContinue} autoFocus>
            Continue <ArrowRight aria-hidden />
          </Button>
        </div>
      </div>
    </div>
  );
}
