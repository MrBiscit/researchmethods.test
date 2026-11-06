import { useState, type FormEvent } from "react";
import { AlertCircle, ArrowRight, Clock, FileText, Loader2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function WelcomeScreen({
  onStart,
  disabled,
}: {
  onStart: (name: string) => Promise<void>;
  disabled?: boolean;
}) {
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name to begin.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await onStart(trimmed);
    } catch (err) {
      setError(
        err instanceof Error
          ? `We couldn't start your session: ${err.message}`
          : "We couldn't start your session. Please try again.",
      );
      setBusy(false);
    }
  }

  return (
    <div className="ruled-backdrop min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.15fr_1fr] md:py-20">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <p className="eyebrow">Study session · approx. 20 minutes</p>
          <h1 className="mt-3 font-serif text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl">
            Welcome to the reading comprehension study.
          </h1>
          <p className="mt-5 max-w-prose text-[1.0625rem] leading-relaxed text-muted-foreground">
            You'll read pairs of short passages that take different positions on a topic, then answer a
            multiple-choice question about how the authors relate to one another. Please read carefully
            and answer as accurately as you can.
          </p>

          <ul className="mt-8 space-y-3.5 text-sm">
            <Feature icon={FileText} title="9 short problems" body="Each has two passages and one question with four options." />
            <Feature icon={Clock} title="Take your time" body="There is no time limit. You may skip any problem you'd rather not answer." />
            <Feature icon={ShieldCheck} title="No account needed" body="We only ask for a display name. Your answers are recorded for research purposes." />
          </ul>
        </div>

        <form
          onSubmit={submit}
          className="sheet self-start p-6 shadow-lift animate-in fade-in slide-in-from-bottom-3 duration-700 sm:p-8"
          noValidate
        >
          <h2 className="font-serif text-2xl font-semibold">Begin your session</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">Enter the name you'd like to be recorded under.</p>

          <div className="mt-6 space-y-2">
            <Label htmlFor="participant-name">Name</Label>
            <Input
              id="participant-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              autoComplete="name"
              placeholder="e.g. Alex Chen"
              aria-invalid={!!error}
              className="h-11 bg-paper"
              disabled={busy || disabled}
            />
          </div>

          {error && (
            <p className="mt-3 flex items-start gap-2 text-sm text-destructive" role="alert">
              <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
              {error}
            </p>
          )}

          <Button type="submit" size="lg" className="mt-6 h-11 w-full" disabled={busy || disabled}>
            {busy ? <Loader2 className="animate-spin" aria-hidden /> : null}
            Start Study
            {!busy && <ArrowRight aria-hidden />}
          </Button>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            By starting, you agree to take part in this study. You may stop at any time.
          </p>
        </form>
      </div>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof FileText;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-3">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-paper text-primary">
        <Icon className="size-4" aria-hidden />
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-muted-foreground">{body}</p>
      </div>
    </li>
  );
}
