"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProviderName, ProviderConfig } from "@/lib/providers/types";

const PROVIDERS: { id: ProviderName; label: string; needsKey: boolean; models: string[] }[] = [
  {
    id: "anthropic",
    label: "Anthropic Claude",
    needsKey: true,
    models: ["claude-opus-4-6", "claude-sonnet-4-6", "claude-haiku-4-5-20251001"],
  },
  {
    id: "openai",
    label: "OpenAI",
    needsKey: true,
    models: ["gpt-4o", "gpt-4o-mini", "o1", "o3-mini"],
  },
  {
    id: "openrouter",
    label: "OpenRouter",
    needsKey: true,
    models: [
      "anthropic/claude-3.5-sonnet",
      "openai/gpt-4o",
      "meta-llama/llama-3.1-70b-instruct",
      "mistralai/mistral-large",
    ],
  },
  {
    id: "zen",
    label: "OpenCode Zen",
    needsKey: true,
    models: ["claude-sonnet-4-5", "gpt-4o"],
  },
  {
    id: "local",
    label: "Local (Ollama)",
    needsKey: false,
    models: ["phi3:mini", "mistral:7b", "llama3.2:3b", "gemma2:9b"],
  },
];

export default function InitPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [provider, setProvider] = useState<ProviderName>("anthropic");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedProvider = PROVIDERS.find((p) => p.id === provider)!;

  async function save() {
    setSaving(true);
    setError("");
    const config: ProviderConfig = {
      provider,
      model: model || selectedProvider.models[0],
      ...(apiKey ? { apiKey } : {}),
      ...(baseUrl ? { baseUrl } : {}),
    };

    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });
      if (!res.ok) throw new Error(await res.text());
      router.push("/");
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-light tracking-wider text-white">mae</h1>
          <p className="mt-2 text-gray-400 text-sm">Minimal Agentic Environment</p>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 space-y-6">
          {step === 0 && (
            <>
              <h2 className="text-lg font-medium">Choose a provider</h2>
              <div className="space-y-2">
                {PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => { setProvider(p.id); setModel(""); }}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                      provider === p.id
                        ? "border-blue-500 bg-blue-950 text-blue-100"
                        : "border-gray-700 hover:border-gray-600 bg-gray-800"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(1)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
              >
                Continue
              </button>
            </>
          )}

          {step === 1 && (
            <>
              <button onClick={() => setStep(0)} className="text-sm text-gray-400 hover:text-gray-200">
                ← Back
              </button>
              <h2 className="text-lg font-medium">Configure {selectedProvider.label}</h2>

              {selectedProvider.needsKey && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">API Key</label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="sk-..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              {provider === "local" && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Ollama base URL <span className="text-gray-600">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="http://localhost:11434/api"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Make sure Ollama is running:{" "}
                    <code className="bg-gray-800 px-1 rounded">curl http://localhost:11434</code>
                    <br />
                    Pull a model first:{" "}
                    <code className="bg-gray-800 px-1 rounded">ollama pull phi3:mini</code>
                  </p>
                </div>
              )}

              {provider === "zen" && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Base URL <span className="text-gray-600">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={baseUrl}
                    onChange={(e) => setBaseUrl(e.target.value)}
                    placeholder="https://api.opencode.ai/v1"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm text-gray-400 mb-1">Model</label>
                <select
                  value={model || selectedProvider.models[0]}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                >
                  {selectedProvider.models.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}

              <button
                onClick={save}
                disabled={saving || (selectedProvider.needsKey && !apiKey)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
              >
                {saving ? "Saving…" : "Start mae"}
              </button>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-600">
          Config saved to <code>mae.config.json</code> (gitignored)
        </p>
      </div>
    </div>
  );
}
