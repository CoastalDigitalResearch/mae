# mae — Minimal Agentic Environment

**A Coastal Digital Research project**

mae is an AI agent that runs on your Linux system and keeps it healthy — applying updates, managing configuration, hardening security, and executing tasks you assign through a web UI. Drop it on a box and it takes over the toil.

## mission

Most Linux maintenance is repetitive, error-prone, and time-consuming. mae replaces that with a persistent AI agent that understands your system's state, reasons about what needs to happen, and acts — without requiring your intervention.

The goal: a self-managing workstation where the human focuses on work, not maintenance.

## what mae does

- **System updates** — monitors and applies OS/package updates
- **Configuration management** — enforces system configuration declaratively
- **Security hardening** — audits and remediates vulnerabilities and drift
- **Agentic loop** — a locally-running AI agent that reasons over system state and executes commands
- **Web UI** — a Next.js interface to chat with, direct, and observe the agent
- **Terminal access** — built-in terminal and command palette for direct system interaction

## multi-provider support

mae works with any of these AI providers — including fully local models:

| Provider | How to use |
|---|---|
| **Anthropic Claude** | Set `ANTHROPIC_API_KEY` (default, uses Claude Code SDK) |
| **OpenAI** | Set `PROVIDER=openai` + `OPENAI_API_KEY` |
| **OpenRouter** | Set `PROVIDER=openrouter` + `OPENROUTER_API_KEY` |
| **OpenCode Zen** | Set `PROVIDER=zen` + `ZEN_API_KEY` |
| **Local (Ollama)** | Set `PROVIDER=local`, run `bash bootstrap/local-model-setup.sh` |

On first launch with no provider configured, mae opens a setup wizard at `/init`.

## quick start

### local development

```bash
bun install
export ANTHROPIC_API_KEY="your-key"
bun run dev
```

Open [http://localhost:3000](http://localhost:3000). If no provider is configured, the setup wizard appears automatically.

### docker

```bash
# with Anthropic (default)
echo "ANTHROPIC_API_KEY=your-key" > .env
docker compose up

# with a different provider
echo "PROVIDER=openai" >> .env
echo "OPENAI_API_KEY=your-key" >> .env
docker compose up

# with local Ollama
docker compose --profile local up
```

### local model (no API key needed)

```bash
# Install Ollama + pull a model
bash bootstrap/local-model-setup.sh

# Or use a self-contained llamafile
bash bootstrap/llamafile-setup.sh

bun run dev
```

See [`bootstrap/models.md`](bootstrap/models.md) for recommended models by hardware.

## architecture

```
src/
├── app/
│   ├── page.tsx              # root (redirects to /init if unconfigured)
│   ├── init/                 # first-run provider setup wizard
│   └── api/
│       ├── chat/route.ts     # AI dispatch (claude-code SDK or streamText)
│       └── config/route.ts   # read/write mae.config.json
├── components/
│   ├── desktop.tsx           # main UI shell
│   ├── claude-chat.tsx       # agent chat panel
│   ├── terminal.tsx          # command palette
│   └── NativeTerminal.tsx    # native terminal
├── lib/
│   ├── config.ts             # mae.config.json loader/writer
│   └── providers/            # multi-provider abstraction
│       ├── types.ts
│       └── index.ts
└── server/api/
    └── routers/
        ├── terminal.ts       # terminal tRPC router
        └── files.ts          # file browser tRPC router

bootstrap/
├── local-model-setup.sh      # install Ollama + pull model
├── llamafile-setup.sh        # download + run Phi-3-mini llamafile
├── models.md                 # recommended models table
├── pxe/                      # PXE network boot (automated Debian install)
└── usb/                      # bootable USB creator
```

## environment variables

| Variable | Description |
|---|---|
| `PROVIDER` | `anthropic` (default) \| `openai` \| `openrouter` \| `zen` \| `local` |
| `MODEL` | Model name for the selected provider |
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `OPENAI_API_KEY` | OpenAI API key |
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `ZEN_API_KEY` | OpenCode Zen API key |
| `BASE_URL` | Custom base URL for `zen` or `local` providers |

Config can also be written to `mae.config.json` (gitignored) via the `/init` wizard.

## deployment

### PXE network boot

Provision a bare machine from the network with a full mae install:

```bash
# See bootstrap/pxe/README.md for TFTP/DHCP setup
# Edit passwords in bootstrap/pxe/preseed.cfg, then boot target machine
```

### USB boot

```bash
bash bootstrap/usb/create-usb.sh /dev/sdX
# Boot target machine from USB — installs Debian + mae unattended
```

## prerequisites

- [Bun](https://bun.sh) >= 1.0
- Docker & Docker Compose (for containerized deployment)
- An API key for your chosen provider, or Ollama for local inference

## project status

Active development. Provider abstraction, init wizard, and bootstrap tooling are complete. The agent loop and deeper system integration are ongoing.

## organization

mae is developed and maintained by [Coastal Digital Research](https://github.com/CoastalDigitalResearch).

## license

MIT
