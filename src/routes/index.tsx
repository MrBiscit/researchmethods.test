import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { StudyHeader } from "@/components/study/StudyHeader";
import { ProgressSteps } from "@/components/study/ProgressSteps";
import { WelcomeScreen } from "@/components/study/WelcomeScreen";
import { PhaseIntro } from "@/components/study/PhaseIntro";
import { QuestionScreen } from "@/components/study/QuestionScreen";
import { CompletionScreen } from "@/components/study/CompletionScreen";
import { SetupNotice } from "@/components/study/SetupNotice";
import { buildStudySteps, shuffledLearningOrder, type StudyStep } from "@/lib/study-content";
import { registerParticipant, type GroupType } from "@/lib/study-api";
import { getMissingBackendConfig } from "@/lib/supabase-config";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Reading Comprehension Study" },
      {
        name: "description",
        content: "Take part in a short research study on reading comprehension and problem solving.",
      },
      { property: "og:title", content: "Reading Comprehension Study" },
      {
        property: "og:description",
        content: "Take part in a short research study on reading comprehension and problem solving.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: StudyPage,
});

interface Session {
  participantId: string;
  name: string;
  group: GroupType;
  /** this participant's random order of the main-phase problem ids */
  learningOrder: string[];
  /** number of problems completed (0..total) */
  completed: number;
  /** whether the condition instructions (before the main phase) have been acknowledged */
  introSeen: boolean;
}

const STORAGE_KEY = "rc-study-session-v2";

/** Condition instructions appear once, right before the first main-phase problem. */
const needsIntro = (s: StudyStep | undefined) => !!s && s.phase === "learning" && s.index === 0;

function StudyPage() {
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [missing, setMissing] = useState<string[]>([]);

  useEffect(() => {
    setMissing(getMissingBackendConfig());
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSession(JSON.parse(raw) as Session);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else localStorage.removeItem(STORAGE_KEY);
  }, [session, hydrated]);

  async function start(name: string) {
    const { participantId, group } = await registerParticipant(name);
    setSession({
      participantId,
      name,
      group,
      learningOrder: shuffledLearningOrder(),
      completed: 0,
      introSeen: false,
    });
  }

  const steps = useMemo(() => buildStudySteps(session?.learningOrder), [session?.learningOrder]);
  const total = steps.length;
  const done = !!session && session.completed >= total;
  const step = session && !done ? steps[session.completed] : undefined;
  const showIntro = needsIntro(step) && !session?.introSeen;

  function advance() {
    setSession((s) => {
      if (!s) return s;
      const completed = s.completed + 1;
      return { ...s, completed, introSeen: s.introSeen && !needsIntro(steps[completed]) };
    });
  }

  const lastStep = steps[total - 1]!;

  return (
    <div className="min-h-screen">
      <StudyHeader>
        {session && step && (
          <ProgressSteps phase={step.phase} completedInPhase={step.index} />
        )}
        {done && <ProgressSteps phase={lastStep.phase} completedInPhase={lastStep.index + 1} done />}
      </StudyHeader>

      {hydrated && missing.length > 0 && <SetupNotice missing={missing} />}

      <main>
        {!hydrated ? null : !session ? (
          <WelcomeScreen onStart={start} disabled={missing.length > 0} />
        ) : done ? (
          <CompletionScreen name={session.name} total={total} onReset={() => setSession(null)} />
        ) : step && showIntro ? (
          <PhaseIntro
            group={session.group}
            onContinue={() => setSession((s) => (s ? { ...s, introSeen: true } : s))}
          />
        ) : step ? (
          <QuestionScreen
            key={step.problem.id}
            step={step}
            group={session.group}
            participantId={session.participantId}
            onDone={advance}
          />
        ) : null}
      </main>
    </div>
  );
}
