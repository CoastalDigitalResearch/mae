# mae — Minimal Agentic Environment

**A Coastal Digital Research project**

mae is an agent-maintained Linux distribution designed to run directly on laptops and workstations. Drop it on a box, and an AI agent running locally takes over: updating packages, configuring the system, hardening security, and keeping everything in good shape — autonomously.

## mission

Most Linux maintenance is repetitive, error-prone, and time-consuming. mae replaces that toil with a persistent AI agent that understands your system, acts on its state, and keeps it healthy — without you having to intervene.

The goal is a self-managing workstation where the human focuses on work, not maintenance.

## what mae does

- **System updates** — monitors and applies OS and package updates
- **Configuration management** — applies and enforces system configuration declaratively
- **Security hardening** — audits and remediates vulnerabilities, misconfigurations, and drift
- **Agentic loop** — a locally-running Claude-powered agent that reasons over system state and takes action
- **Web UI** — a Next.js interface to observe, direct, and audit the agent

## architecture

mae runs as a containerized Next.js application with a tRPC API. The agent loop uses the Claude Code SDK to reason about the host system and execute remediation tasks.

```
.
├── src/
│   ├── app/              # next.js app router
│   ├── server/           # trpc server & api
│   ├── utils/            # utility functions
│   └── claude-code-handler.ts  # claude code sdk integration
├── public/               # static assets
├── Dockerfile            # production docker image
└── docker-compose.yml    # docker compose configuration
```

## prerequisites

- bun
- docker & docker-compose
- anthropic api key

## quick start

### local development

```bash
bun install
export ANTHROPIC_API_KEY="your-api-key"
bun run dev
```

Open http://localhost:3000

### docker

```bash
echo "ANTHROPIC_API_KEY=your-api-key" > .env
docker compose down && docker compose build --no-cache && docker compose up
```

Open http://localhost:3000

## api

The tRPC endpoint at `/api/trpc/click.sendToClaudeCode` accepts:

```typescript
{
  prompt: string,   // instruction for the agent
  context?: any     // optional system context
}
```

## environment variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Required. Claude API key. |
| `NODE_ENV` | Set to `production` for production builds. |
| `PORT` | Server port (default: 3000). |

## project status

Early development. The foundation is in place; the agent loop and system integration are actively being built.

## organization

mae is developed and maintained by [Coastal Digital Research](https://github.com/CoastalDigitalResearch).

## license

MIT
