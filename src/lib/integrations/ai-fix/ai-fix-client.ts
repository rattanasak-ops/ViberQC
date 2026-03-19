// ============================================================
// ViberQC — AI Fix Client
// Uses fetch() to call AI APIs directly (no SDK imports)
// Priority: Claude Haiku → GPT-4o-mini → Gemini Flash
// ============================================================

import type { AiFixInput, AiFixSuggestion } from "./types";

type AiProvider = "openrouter" | "claude" | "openai" | "gemini";

interface ProviderConfig {
  name: AiProvider;
  envKey: string;
  costPerMillionTokens: number; // cents per 1M tokens (input+output avg)
}

const PROVIDERS: ProviderConfig[] = [
  {
    name: "openrouter",
    envKey: "OPENROUTER_API_KEY",
    costPerMillionTokens: 15,
  },
  { name: "claude", envKey: "ANTHROPIC_API_KEY", costPerMillionTokens: 100 },
  { name: "openai", envKey: "OPENAI_API_KEY", costPerMillionTokens: 30 },
  { name: "gemini", envKey: "GOOGLE_GEMINI_API_KEY", costPerMillionTokens: 0 },
];

/**
 * Generate a fix suggestion for a single issue.
 * Tries providers in order: Claude Haiku → GPT-4o-mini → Gemini Flash
 */
export async function generateFix(input: AiFixInput): Promise<AiFixSuggestion> {
  const prompt = buildPrompt(input);

  for (const provider of PROVIDERS) {
    const apiKey = process.env[provider.envKey];
    if (!apiKey) continue;

    try {
      const result = await callProvider(provider, apiKey, prompt);
      const parsed = parseFixResponse(result.content, input);

      return {
        issueId: input.issueId,
        fixCode: parsed.fixCode,
        explanation: parsed.explanation,
        language: parsed.language,
        fileHint: parsed.fileHint,
        confidence: parsed.confidence,
        provider: provider.name,
        tokensUsed: result.tokensUsed,
        costCents: Math.ceil(
          (result.tokensUsed / 1_000_000) * provider.costPerMillionTokens,
        ),
      };
    } catch (error) {
      console.warn(`[ai-fix] ${provider.name} failed:`, error);
      continue;
    }
  }

  throw new Error("All AI providers failed to generate fix");
}

// -----------------------------------------------------------
// Provider Calls (fetch-based, no SDK)
// -----------------------------------------------------------

interface AiResult {
  content: string;
  tokensUsed: number;
}

async function callProvider(
  provider: ProviderConfig,
  apiKey: string,
  prompt: string,
): Promise<AiResult> {
  switch (provider.name) {
    case "openrouter":
      return callOpenRouter(apiKey, prompt);
    case "claude":
      return callClaude(apiKey, prompt);
    case "openai":
      return callOpenAI(apiKey, prompt);
    case "gemini":
      return callGemini(apiKey, prompt);
    default:
      throw new Error(`Unknown provider: ${provider.name}`);
  }
}

async function callOpenRouter(
  apiKey: string,
  prompt: string,
): Promise<AiResult> {
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer":
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:6161",
      "X-Title": "ViberQC",
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-001",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`OpenRouter API error: ${res.status} ${body}`);
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
    usage: { total_tokens: number };
  };

  return {
    content: data.choices?.[0]?.message?.content ?? "",
    tokensUsed: data.usage?.total_tokens ?? 0,
  };
}

async function callClaude(apiKey: string, prompt: string): Promise<AiResult> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Claude API error: ${res.status} ${body}`);
  }

  const data = (await res.json()) as {
    content: { type: string; text: string }[];
    usage: { input_tokens: number; output_tokens: number };
  };

  const text = data.content?.find((b) => b.type === "text")?.text ?? "";
  return {
    content: text,
    tokensUsed:
      (data.usage?.input_tokens ?? 0) + (data.usage?.output_tokens ?? 0),
  };
}

async function callOpenAI(apiKey: string, prompt: string): Promise<AiResult> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 2048,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`OpenAI API error: ${res.status} ${body}`);
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
    usage: { total_tokens: number };
  };

  return {
    content: data.choices?.[0]?.message?.content ?? "",
    tokensUsed: data.usage?.total_tokens ?? 0,
  };
}

async function callGemini(apiKey: string, prompt: string): Promise<AiResult> {
  const model = "gemini-2.0-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 2048 },
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Gemini API error: ${res.status} ${body}`);
  }

  const data = (await res.json()) as {
    candidates: { content: { parts: { text: string }[] } }[];
    usageMetadata?: { totalTokenCount: number };
  };

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  return {
    content: text,
    tokensUsed: data.usageMetadata?.totalTokenCount ?? 0,
  };
}

// -----------------------------------------------------------
// Prompt Builder
// -----------------------------------------------------------

function buildPrompt(input: AiFixInput): string {
  const contextParts: string[] = [];
  if (input.context.url) contextParts.push(`URL: ${input.context.url}`);
  if (input.context.htmlSnippet)
    contextParts.push(`HTML Snippet:\n${input.context.htmlSnippet}`);
  if (input.context.headers)
    contextParts.push(
      `HTTP Headers:\n${JSON.stringify(input.context.headers, null, 2)}`,
    );

  return `You are a web quality expert. Analyze this issue and provide a fix.

## Issue
- Phase: ${input.phase}
- Severity: ${input.severity}
- Title: ${input.title}
- Description: ${input.description}
${input.recommendation ? `- Recommendation: ${input.recommendation}` : ""}

## Context
${contextParts.length > 0 ? contextParts.join("\n\n") : "No additional context provided."}

## Response Format (JSON only, no markdown)
{
  "fixCode": "the actual code fix (HTML, CSS, JS, config, etc.)",
  "explanation": "brief explanation of why this fix works",
  "language": "html|css|javascript|typescript|json|nginx|apache|other",
  "fileHint": "suggested file path or null",
  "confidence": 0.85
}

Respond ONLY with the JSON object, no markdown fences or extra text.`;
}

// -----------------------------------------------------------
// Response Parser
// -----------------------------------------------------------

interface ParsedFix {
  fixCode: string;
  explanation: string;
  language: string;
  fileHint: string | null;
  confidence: number;
}

function parseFixResponse(content: string, input: AiFixInput): ParsedFix {
  // Try to parse JSON from the response
  const cleaned = content
    .replace(/```json\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned) as Record<string, unknown>;
    return {
      fixCode: String(parsed.fixCode ?? ""),
      explanation: String(parsed.explanation ?? ""),
      language: String(parsed.language ?? "other"),
      fileHint: parsed.fileHint ? String(parsed.fileHint) : null,
      confidence: Number(parsed.confidence) || 0.5,
    };
  } catch {
    // If parsing fails, return the raw content as explanation
    return {
      fixCode: "",
      explanation: content.slice(0, 1000),
      language: "other",
      fileHint: null,
      confidence: 0.3,
    };
  }
}
