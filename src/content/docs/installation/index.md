---
title: Desktop installation
description: Install, verify, upgrade, or remove the packaged PulseRN desktop app on macOS, Windows, and Linux.
---

PulseRN desktop builds are published through [GitHub Releases](https://github.com/maahibhama/PulseRN/releases). Preview releases are unsigned.

Prefer not to install Electron? With Node.js 22.5 or newer, follow [Run in a
browser](/PulseRN-Site/browser/) to launch the same debugger UI from the published CLI.

## Homebrew

```bash
brew tap maahibhama/pulsern https://github.com/maahibhama/PulseRN
brew install --cask --no-quarantine pulsern
```

Upgrade or remove it:

```bash
brew update
brew upgrade --cask pulsern
brew uninstall --cask pulsern
brew untap maahibhama/pulsern
```

Use `brew uninstall --cask --zap pulsern` to also remove settings and the local event database.

## macOS DMG

1. Download `PulseRN-<version>-mac-arm64.dmg` for Apple Silicon or `PulseRN-<version>-mac-x64.dmg` for Intel.
2. Open the DMG and drag PulseRN to Applications.
3. If Gatekeeper blocks it, right-click PulseRN and select **Open**.

Removing the app does not remove data under `~/Library/Application Support/PulseRN`.

## Windows

Use `PulseRN-<version>-windows-x64-setup.exe` for most PCs or the ARM64 installer for Windows on ARM. If SmartScreen appears, select **More info → Run anyway**. Uninstall from **Settings → Apps → Installed apps**.

## Linux

Run the x86-64 AppImage:

```bash
chmod +x PulseRN-<version>-linux-x64.AppImage
./PulseRN-<version>-linux-x64.AppImage
```

Or install the Debian package:

```bash
sudo apt install ./PulseRN-<version>-linux-x64.deb
```

Linux ARM packages are not currently available.

## Verify a download

Download `SHA256SUMS.txt` beside the installer:

```bash
# Linux
sha256sum --check SHA256SUMS.txt

# macOS
shasum --algorithm 256 --check SHA256SUMS.txt
```

The checksum file covers every artifact, so missing-file messages are expected when you downloaded only one. The selected installer must report `OK`.

## Expected result

PulseRN opens, listens locally on port `9090`, and is ready for an SDK connection. The first-run
checklist verifies the SDK, debugger port, device, Metro/Hermes, and first event. Continue with
[Getting started](/PulseRN-Site/getting-started/).

## Troubleshooting

- Security warnings are expected for unsigned preview builds.
- If port `9090` is occupied, stop the conflicting process; the SDK and desktop port must match.
- Physical devices are supported through [authenticated LAN pairing](/PulseRN-Site/connections/).
- Automatic updates are available only in eligible signed packaged builds; unsigned previews use
  direct downloads.
