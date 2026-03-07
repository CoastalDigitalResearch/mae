# mae — Minimal Agentic Environment
FROM oven/bun:1-slim

# Create a non-root user
RUN adduser --system --uid 502 --gid 20 nextjs 2>/dev/null || true

WORKDIR /app

# Install claude-code globally
RUN bun add -g @anthropic-ai/claude-code

# Copy package files and install dependencies
COPY package.json bun.lock ./
RUN bun install

# Copy application files
COPY --chown=nextjs:staff . .

# Create home directory and set ownership
RUN mkdir -p /home/nextjs && chown -R nextjs:staff /home/nextjs /app

USER nextjs

ENV HOME=/home/nextjs
ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV HOSTNAME="0.0.0.0"

EXPOSE 3000

CMD ["bun", "run", "dev"]
