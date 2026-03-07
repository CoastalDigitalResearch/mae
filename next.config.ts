import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['@anthropic-ai/claude-code', '@ai-sdk/openai', '@openrouter/ai-sdk-provider'],
};

export default nextConfig;
