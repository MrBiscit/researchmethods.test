import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlertCircle, ArrowUp, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { askAssistant } from "@/lib/assistant.functions";
import type { Problem } from "@/lib/study-content";

export const ASSISTANT_GREETING =
  "Hi! I'm here to help you with this reading comprehension question. I can see the text and the question. Feel free to ask anything!";

type Msg = { role: "user" | "assistant"; content: string };

export function AssistantPanel({ problem }: { problem: Problem }) {
  const ask = useServerFn(askAssistant);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, pending, error]);

  async function send(history: Msg[]) {
    setPending(true);
    setError(null);
    try {
      const res = await ask({ data: { problemId: problem.id, messages: history.slice(-20) } });
      if (res.ok) {
        setMessages([...history, { role: "assistant", content: res.reply }]);
      } else {
        setError(res.error);
      }
    } catch {
      setError("Couldn't reach the assistant. Check your connection and try again.");
    } finally {
      setPending(false);
    }
  }

  function onSubmit(e?: FormEvent) {
    e?.preventDefault();
    const text = draft.trim().slice(0, 2000);
    if (!text || pending) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setDraft("");
    void send(next);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  }

  const lastIsUser = messages.at(-1)?.role === "user";

  return (
    <aside className="sheet flex h-full min-h-[460px] flex-col overflow-hidden" aria-label="AI assistant">
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Sparkles className="size-3.5" aria-hidden />
          </div>
          <div className="leading-tight">
            <h2 className="text-sm font-semibold">AI Assistant</h2>
            <p className="text-xs text-muted-foreground">Powered by Gemini</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="size-1.5 rounded-full bg-success" aria-hidden /> Online
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
        <Bubble role="assistant">{ASSISTANT_GREETING}</Bubble>
        {messages.map((m, i) => (
          <Bubble key={i} role={m.role}>
            {m.content}
          </Bubble>
        ))}
        {pending && (
          <div className="flex items-center gap-1 px-1 py-2" aria-label="Assistant is typing">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="typing-dot size-1.5 rounded-full bg-muted-foreground"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}
        {error && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
            <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
            <div className="flex-1">
              <p>{error}</p>
              {lastIsUser && (
                <button
                  type="button"
                  onClick={() => void send(messages)}
                  className="mt-1.5 inline-flex items-center gap-1 text-xs font-medium underline underline-offset-2"
                >
                  <RotateCcw className="size-3" aria-hidden /> Try again
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <form onSubmit={onSubmit} className="border-t border-border bg-background/60 p-3">
        <div className="flex items-end gap-2 rounded-lg border border-input bg-paper px-3 py-2 focus-within:border-ring focus-within:ring-1 focus-within:ring-ring">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            maxLength={2000}
            placeholder="Ask about the passages or question…"
            aria-label="Message the AI assistant"
            className="max-h-32 min-h-6 flex-1 resize-none bg-transparent text-sm leading-6 outline-none placeholder:text-muted-foreground"
          />
          <Button type="submit" size="icon" className="size-8 shrink-0 rounded-md" disabled={!draft.trim() || pending} aria-label="Send">
            <ArrowUp aria-hidden />
          </Button>
        </div>
        <p className="mt-1.5 px-1 text-[0.6875rem] text-muted-foreground">Enter to send · Shift+Enter for a new line</p>
      </form>
    </aside>
  );
}

function Bubble({ role, children }: { role: "user" | "assistant"; children: string }) {
  return (
    <div className={cn("flex", role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
          role === "user"
            ? "rounded-br-sm bg-primary text-primary-foreground"
            : "rounded-bl-sm bg-muted text-foreground",
        )}
      >
        {children}
      </div>
    </div>
  );
}
