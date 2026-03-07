#!/usr/bin/env bash
set -euo pipefail

PORT="${PORT:-8080}"
MODEL_NAME="Phi-3-mini-4k-instruct.Q4_K_M"
LLAMAFILE_URL="https://huggingface.co/Mozilla/Phi-3-mini-4k-instruct-llamafile/resolve/main/${MODEL_NAME}.llamafile"
DEST="$(dirname "$0")/${MODEL_NAME}.llamafile"

echo "=== mae llamafile setup ==="

if [ ! -f "$DEST" ]; then
  echo "Downloading $MODEL_NAME (~2.3 GB)..."
  curl -L --progress-bar -o "$DEST" "$LLAMAFILE_URL"
fi

chmod +x "$DEST"

echo "Starting llamafile server on port $PORT..."
"$DEST" --server --port "$PORT" --nobrowser &
sleep 5

# Write .env
ENV_FILE="$(dirname "$0")/../.env"
if [ ! -f "$ENV_FILE" ] || ! grep -q "^PROVIDER=" "$ENV_FILE"; then
  echo "" >> "$ENV_FILE"
  echo "PROVIDER=local" >> "$ENV_FILE"
  echo "MODEL=phi3" >> "$ENV_FILE"
  echo "BASE_URL=http://localhost:${PORT}/v1" >> "$ENV_FILE"
  echo "Written provider config to .env"
fi

echo ""
echo "llamafile running at http://localhost:${PORT}"
echo "Run 'bun run dev' to start mae."
