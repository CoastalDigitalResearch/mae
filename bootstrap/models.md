# Recommended Local Models

| Model | Size on disk | RAM needed | Best for |
|---|---|---|---|
| phi3:mini (3.8B Q4) | 2.3 GB | 4 GB | Low-resource bootstrap |
| llama3.2:3b | 2.0 GB | 4 GB | Fast responses |
| mistral:7b (Q4) | 4.1 GB | 8 GB | Better reasoning |
| gemma2:9b (Q4) | 5.5 GB | 12 GB | Strong instruction following |

## Ollama quick start

```bash
# Install
curl -fsSL https://ollama.com/install.sh | sh

# Pull a model
ollama pull phi3:mini

# Verify it's running
curl http://localhost:11434
```

## llamafile quick start

```bash
bash bootstrap/llamafile-setup.sh
```

Downloads Phi-3-mini as a self-contained executable and starts an OpenAI-compatible server on port 8080.
