import type { Phase } from "./study-content";
import type { ResponseOutcome } from "./scoring";

export type GroupType = "control" | "ai_assisted";

async function client() {
  const { supabase } = await import("@/integrations/supabase/client");
  return supabase;
}

export async function registerParticipant(
  name: string,
): Promise<{ participantId: string; group: GroupType }> {
  const supabase = await client();
  const { data, error } = await supabase.rpc("register_participant", { _name: name });
  if (error) throw new Error(error.message || "Could not register participant.");
  const row = data?.[0];
  if (!row || (row.group_type !== "control" && row.group_type !== "ai_assisted")) {
    throw new Error("Registration returned an unexpected response.");
  }
  return { participantId: row.participant_id, group: row.group_type };
}

export async function saveResult(input: {
  participantId: string;
  phase: Phase;
  problemIndex: number;
  outcome: ResponseOutcome;
}): Promise<void> {
  const supabase = await client();
  const { error } = await supabase.from("test_results").insert({
    participant_id: input.participantId,
    test_type: input.phase,
    problem_index: input.problemIndex,
    score: input.outcome.score,
    time_taken_seconds: input.outcome.time_taken_seconds,
    is_skipped: input.outcome.is_skipped,
  });
  // 23505 = already saved (e.g. a retry after a dropped connection) — treat as success.
  if (error && error.code !== "23505") {
    throw new Error(error.message || "Could not save your response.");
  }
}
