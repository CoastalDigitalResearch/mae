import type { ProviderConfig, ProviderName } from './types';
import { loadConfig } from '@/lib/config';

export type { ProviderConfig, ProviderName };

export function getProviderConfig(): ProviderConfig {
  const saved = loadConfig();
  if (saved) return saved;

  const provider = (process.env.PROVIDER ?? 'anthropic') as ProviderName;
  const model = process.env.MODEL ?? defaultModel(provider);

  return {
    provider,
    model,
    apiKey: apiKeyForProvider(provider),
    baseUrl: process.env.BASE_URL,
  };
}

function defaultModel(provider: ProviderName): string {
  switch (provider) {
    case 'anthropic': return 'claude-sonnet-4-5';
    case 'openai': return 'gpt-4o';
    case 'openrouter': return 'anthropic/claude-3.5-sonnet';
    case 'zen': return 'claude-sonnet-4-5';
    case 'local': return 'phi3:mini';
  }
}

function apiKeyForProvider(provider: ProviderName): string | undefined {
  switch (provider) {
    case 'anthropic': return process.env.ANTHROPIC_API_KEY;
    case 'openai': return process.env.OPENAI_API_KEY;
    case 'openrouter': return process.env.OPENROUTER_API_KEY;
    case 'zen': return process.env.ZEN_API_KEY;
    case 'local': return undefined;
  }
}

export async function getLanguageModel(config: ProviderConfig) {
  switch (config.provider) {
    case 'openai': {
      const { createOpenAI } = await import('@ai-sdk/openai');
      const openai = createOpenAI({ apiKey: config.apiKey });
      return openai(config.model);
    }
    case 'openrouter': {
      const { createOpenRouter } = await import('@openrouter/ai-sdk-provider');
      const openrouter = createOpenRouter({ apiKey: config.apiKey });
      return openrouter(config.model);
    }
    case 'zen': {
      const { createOpenAI } = await import('@ai-sdk/openai');
      const zen = createOpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseUrl ?? 'https://api.opencode.ai/v1',
      });
      return zen(config.model);
    }
    case 'local': {
      // Ollama exposes an OpenAI-compatible API at port 11434
      const { createOpenAI } = await import('@ai-sdk/openai');
      const ollama = createOpenAI({
        apiKey: 'ollama', // required but ignored by Ollama
        baseURL: config.baseUrl ?? 'http://localhost:11434/v1',
      });
      return ollama(config.model);
    }
    default:
      throw new Error(`Provider ${config.provider} does not use a language model (use anthropic path instead)`);
  }
}
