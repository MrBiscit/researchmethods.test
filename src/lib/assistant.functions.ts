import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { findProblem } from "./study-content";

const inputSchema = z.object({
  problemId: z.string().min(1).max(40),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(30),
});

export type AssistantReply = { ok: true; reply: string } | { ok: false; error: string };

// Gemini Developer API (Google AI Studio key). The key is read on the server only
// (GEMINI_API_KEY) and is never sent to the browser. Override the model with GEMINI_MODEL.
const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models";
const DEFAULT_GEMINI_MODEL = "gemini-3.8-flash";
const REQUEST_TIMEOUT_MS = 30_000;

type GeminiResponse = {
  candidates?: { content?: { parts?: { text?: string; thought?: boolean }[] } }[];
  promptFeedback?: { blockReason?: string };
};

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }): Promise<AssistantReply> => {
    const problem = findProblem(data.problemId);
    if (!problem) return { ok: false, error: "Unknown problem." };

    const apiKey = process.env["GEMINI_API_KEY"];
    if (!apiKey) {
      console.error("Assistant: GEMINI_API_KEY is not set on the server.");
      return { ok: false, error: "The assistant isn't configured yet. Please tell the researcher." };
    }
    const model = process.env["GEMINI_MODEL"] || DEFAULT_GEMINI_MODEL;

    const context = [
      `PASSAGE A:\n${problem.passageA.join("\n\n")}`,
      `PASSAGE B:\n${problem.passageB.join("\n\n")}`,
      `QUESTION:\n${problem.question}`,
      `OPTIONS:\n${(["A", "B", "C", "D"] as const).map((k) => `${k}) ${problem.options[k]}`).join("\n")}`,
    ].join("\n\n");

    const system = `You are a helpful AI assistant embedded in a reading comprehension task. The participant can see the same two passages, question, and four answer options shown below. Answer their questions clearly and concisely (usually under 150 words). Use plain prose without markdown headings.\n\n${context}`;

    try {
      const res = await fetch(`${GEMINI_ENDPOINT}/${encodeURIComponent(model)}:generateContent`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
        signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          // Gemini calls the assistant role "model".
          contents: data.messages.map((m) => ({
            role: m.role === "assistant" ? "model" : "user",
            parts: [{ text: m.content }],
          })),
        }),
      });

      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        console.error("Assistant Gemini error", res.status, detail.slice(0, 500));
        if (res.status === 429) {
          return { ok: false, error: "The assistant is busy right now. Please wait a moment and try again." };
        }
        if (res.status === 400 || res.status === 401 || res.status === 403) {
          return { ok: false, error: "The assistant is temporarily unavailable (configuration problem)." };
        }
        return { ok: false, error: "The assistant couldn't respond. Please try again." };
      }

      const json = (await res.json()) as GeminiResponse;
      if (json.promptFeedback?.blockReason) {
        return { ok: false, error: "The assistant couldn't answer that. Try rephrasing your question." };
      }
      const text = (json.candidates?.[0]?.content?.parts ?? [])
        .filter((p) => !p.thought)
        .map((p) => p.text ?? "")
        .join("")
        .trim();
      if (!text) return { ok: false, error: "The assistant returned an empty reply." };
      return { ok: true, reply: text };
    } catch (err) {
      console.error("Assistant error", err);
      return { ok: false, error: "The assistant couldn't respond. Please try again." };
    }
  });
