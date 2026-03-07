#!/usr/bin/env bash
set -euo pipefail

DEVICE="${1:-}"
if [ -z "$DEVICE" ]; then
  echo "Usage: $0 /dev/sdX"
  echo "WARNING: This will WIPE the target device."
  exit 1
fi

WORK_DIR="$(mktemp -d)"
trap "rm -rf $WORK_DIR" EXIT

echo "=== mae USB creator ==="
echo "Target device: $DEVICE"
read -rp "Are you sure? This will wipe $DEVICE [y/N] " confirm
[[ "$confirm" =~ ^[Yy]$ ]] || exit 1

# Download Debian 12 netinst ISO if not cached
ISO_URL="https://cdimage.debian.org/debian-cd/current/amd64/iso-cd/debian-12.10.0-amd64-netinst.iso"
ISO_CACHE="/tmp/debian-12-netinst.iso"
if [ ! -f "$ISO_CACHE" ]; then
  echo "Downloading Debian 12 netinst (~650 MB)..."
  curl -L --progress-bar -o "$ISO_CACHE" "$ISO_URL"
fi

# Write ISO to USB
echo "Writing ISO to $DEVICE..."
dd if="$ISO_CACHE" of="$DEVICE" bs=4M status=progress oflag=sync

# Mount the USB and add mae files to a secondary partition
# (Alternatively, use a custom preseed on the USB)
echo "Adding mae preseed to USB..."
MOUNT_DIR="$(mktemp -d)"
mount "$DEVICE" "$MOUNT_DIR" 2>/dev/null || true

# Copy preseed config
cp "$(dirname "$0")/../pxe/preseed.cfg" "$MOUNT_DIR/preseed.cfg" 2>/dev/null || true

umount "$MOUNT_DIR" 2>/dev/null || true
rm -rf "$MOUNT_DIR"

echo ""
echo "USB ready. Boot from $DEVICE to install mae."
echo "Add 'preseed/file=/cdrom/preseed.cfg' to the boot parameters for unattended install."
