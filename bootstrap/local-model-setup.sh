#!/usr/bin/env bash
set -euo pipefail

MODEL="${1:-phi3:mini}"

echo "=== mae local model setup ==="

# Install Ollama if not present
if ! command -v ollama &>/dev/null; then
  echo "Installing Ollama..."
  curl -fsSL https://ollama.com/install.sh | sh
fi

# Start Ollama service if not running
if ! curl -sf http://localhost:11434 &>/dev/null; then
  echo "Starting Ollama..."
  ollama serve &
  sleep 3
fi

echo "Pulling model: $MODEL"
ollama pull "$MODEL"

# Write .env if not already set
ENV_FILE="$(dirname "$0")/../.env"
if [ ! -f "$ENV_FILE" ] || ! grep -q "^PROVIDER=" "$ENV_FILE"; then
  echo "" >> "$ENV_FILE"
  echo "PROVIDER=local" >> "$ENV_FILE"
  echo "MODEL=$MODEL" >> "$ENV_FILE"
  echo "Written PROVIDER=local and MODEL=$MODEL to .env"
fi

echo ""
echo "Done. Run 'bun run dev' to start mae with the local model."
