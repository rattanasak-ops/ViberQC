// ============================================================
// ViberQC — Unified AI Client (Multi-Model Router)
// Primary: Claude → Fallback: OpenAI → Gemini → Grok
// ============================================================

import type { AIProvider, AIModelTier, AIResponse } from "@/types";

const AI_MODELS = {
  claude: {
    fast: "claude-haiku-4-5-20251001",
    smart: "claude-sonnet-4-6",
  },
  openai: {
    fast: "gpt-4o-mini",
    smart: "gpt-4o",
  },
  gemini: {
    fast: "gemini-2.0-flash",
    smart: "gemini-2.0-flash",
  },
  grok: {
    fast: "grok-2",
    smart: "grok-2",
  },
} as const;

const PROVIDER_ORDER: AIProvider[] = ["claude", "openai", "gemini", "grok"];

// Smart phases that need higher-quality model
const SMART_PHASES = [4, 7]; // Security + Functional

export function getModelTierForPhase(phaseNumber: number): AIModelTier {
  return SMART_PHASES.includes(phaseNumber) ? "smart" : "fast";
}

export async function callAI(
  prompt: string,
  tier: AIModelTier = "fast"
): Promise<AIResponse> {
  for (const provider of PROVIDER_ORDER) {
    try {
      const result = await callProvider(provider, prompt, tier);
      return result;
    } catch (error) {
      console.warn(`${provider} failed, trying next provider:`, error);
      continue;
    }
  }

  throw new Error("All AI providers failed");
}

async function callProvider(
  provider: AIProvider,
  prompt: string,
  tier: AIModelTier
): Promise<AIResponse> {
  const model = AI_MODELS[provider][tier];

  switch (provider) {
    case "claude":
      return callClaude(prompt, model);
    case "openai":
      return callOpenAI(prompt, model);
    case "gemini":
      return callGemini(prompt, model);
    case "grok":
      return callGrok(prompt, model);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

async function callClaude(prompt: string, model: string): Promise<AIResponse> {
  const { default: Anthropic } = await import("@anthropic-ai/sdk");
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

  const response = await client.messages.create({
    model,
    max_tokens: 4096,
    messages: [{ role: "user", content: prompt }],
  });

  const textBlock = response.content.find((block) => block.type === "text");

  return {
    content: textBlock?.text ?? "",
    provider: "claude",
    confidence: 0.95,
    tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
    costUSD: 0, // calculated separately
  };
}

async function callOpenAI(prompt: string, model: string): Promise<AIResponse> {
  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

  const response = await client.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 4096,
  });

  return {
    content: response.choices[0]?.message?.content ?? "",
    provider: "openai",
    confidence: 0.90,
    tokensUsed: response.usage?.total_tokens ?? 0,
    costUSD: 0,
  };
}

async function callGemini(prompt: string, model: string): Promise<AIResponse> {
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);
  const genModel = genAI.getGenerativeModel({ model });

  const result = await genModel.generateContent(prompt);
  const response = result.response;

  return {
    content: response.text(),
    provider: "gemini",
    confidence: 0.85,
    tokensUsed: 0,
    costUSD: 0,
  };
}

async function callGrok(prompt: string, model: string): Promise<AIResponse> {
  const { default: OpenAI } = await import("openai");
  const client = new OpenAI({
    apiKey: process.env.XAI_GROK_API_KEY!,
    baseURL: "https://api.x.ai/v1",
  });

  const response = await client.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 4096,
  });

  return {
    content: response.choices[0]?.message?.content ?? "",
    provider: "grok",
    confidence: 0.85,
    tokensUsed: response.usage?.total_tokens ?? 0,
    costUSD: 0,
  };
}
