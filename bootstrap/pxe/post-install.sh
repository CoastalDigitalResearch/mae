#!/usr/bin/env bash
set -euo pipefail

echo "=== mae post-install bootstrap ==="

# Install Docker if not present
if ! command -v docker &>/dev/null; then
  curl -fsSL https://get.docker.com | sh
  usermod -aG docker mae
fi

# Install Bun
if ! command -v bun &>/dev/null; then
  curl -fsSL https://bun.sh/install | bash
  export PATH="$HOME/.bun/bin:$PATH"
fi

# Clone mae
MAE_DIR="/opt/mae"
if [ ! -d "$MAE_DIR" ]; then
  git clone https://github.com/caffeinum/mae "$MAE_DIR"
fi

cd "$MAE_DIR"
bun install

# Bootstrap local model
bash bootstrap/local-model-setup.sh phi3:mini

# Start mae as a systemd service
cat > /etc/systemd/system/mae.service <<'EOF'
[Unit]
Description=mae — Minimal Agentic Environment
After=network.target

[Service]
Type=simple
User=mae
WorkingDirectory=/opt/mae
ExecStart=/root/.bun/bin/bun run start
Restart=on-failure
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable mae
systemctl start mae

echo ""
echo "mae is running at http://localhost:3000"
