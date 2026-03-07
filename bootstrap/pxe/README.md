# mae PXE Bootstrap

Automated Debian 12 install that configures a machine as a mae node.

## Requirements

- A TFTP/DHCP server on your LAN (e.g. dnsmasq)
- Debian 12 netboot image

## Setup

1. Copy the Debian netboot files to your TFTP root
2. Configure your DHCP server to point PXE clients at the netboot image
3. Add `preseed/url=http://YOUR_SERVER/preseed.cfg` to the kernel command line
4. Update the root/mae passwords in `preseed.cfg`
5. Boot the target machine from network

## What happens

1. Debian installs unattended with LVM partitioning
2. Docker and Git are installed
3. `post-install.sh` runs: installs Bun, clones mae, sets up Ollama with phi3:mini
4. mae starts as a systemd service on port 3000
