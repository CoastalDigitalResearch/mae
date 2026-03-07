import fs from 'fs';
import path from 'path';
import type { ProviderConfig } from './providers/types';

const CONFIG_PATH = path.join(process.cwd(), 'mae.config.json');

export function loadConfig(): ProviderConfig | null {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, 'utf-8');
      return JSON.parse(raw) as ProviderConfig;
    }
  } catch {
    // ignore malformed config
  }
  return null;
}

export function saveConfig(config: ProviderConfig): void {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
}

export function isConfigured(): boolean {
  if (loadConfig() !== null) return true;
  // Also consider configured if PROVIDER env is explicitly set
  return !!process.env.PROVIDER || !!process.env.ANTHROPIC_API_KEY;
}
