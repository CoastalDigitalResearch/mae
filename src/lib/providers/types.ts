export type ProviderName = 'anthropic' | 'openai' | 'openrouter' | 'zen' | 'local';

export interface ProviderConfig {
  provider: ProviderName;
  model: string;
  apiKey?: string;
  baseUrl?: string; // for zen (OpenAI-compatible) and local
}
