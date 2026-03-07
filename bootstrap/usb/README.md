# mae USB Bootstrap

Create a bootable USB stick that installs mae on any x86_64 machine.

## Usage

```bash
# Find your USB device
lsblk

# Create the USB (WILL WIPE THE DEVICE)
bash bootstrap/usb/create-usb.sh /dev/sdX
```

## What's on the USB

- Debian 12 netinstall ISO
- `preseed.cfg` for unattended installation

## Boot instructions

1. Insert USB and boot target machine
2. Enter BIOS/UEFI and select USB as first boot device
3. At the Debian boot menu, press `Tab` (BIOS) or `e` (UEFI) to edit boot parameters
4. Add: `preseed/file=/cdrom/preseed.cfg auto=true priority=critical`
5. Press Enter — installation runs unattended

After ~15 minutes the machine reboots into mae running at `http://localhost:3000`.
