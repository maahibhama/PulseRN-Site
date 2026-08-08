---
title: Run in a browser
description: Launch the complete PulseRN React Native debugger locally in a browser with Node.js and the published CLI.
---

Run the same PulseRN debugger UI in a local browser without installing the Electron application.
The published CLI requires Node.js 22.5 or newer.

## Start with npx

```bash
npx @maahibhama/pulsern
```

PulseRN runs in the foreground, opens an authenticated browser page automatically, and prints the
addresses for the browser UI, React Native SDK, Android emulator, physical devices, and Metro.
Keep the terminal open while debugging and press `Ctrl+C` to stop all PulseRN services cleanly.

The default addresses are:

| Service               | Address                 |
| --------------------- | ----------------------- |
| Browser UI            | `http://localhost:3000` |
| SDK and iOS Simulator | `ws://127.0.0.1:9090`   |
| Android Emulator      | `ws://10.0.2.2:9090`    |
| Metro and Hermes      | `http://127.0.0.1:8081` |

If the browser does not open, copy the `PulseRN web` address printed in the terminal.

## Install with Homebrew

On macOS, Homebrew can install a compatible Node runtime and the PulseRN CLI together:

```bash
brew tap maahibhama/pulsern https://github.com/maahibhama/PulseRN
brew install maahibhama/pulsern/pulsern-cli
pulsern
```

The tap command is required once per computer. On later launches, run `pulsern`.

Update or remove the CLI with:

```bash
brew update
brew upgrade pulsern-cli
```

```bash
brew uninstall pulsern-cli
brew untap maahibhama/pulsern
```

## Connect a React Native app

The browser and desktop editions use the same `@pulse-rn/sdk` integration. Start PulseRN, then
follow [SDK setup](/PulseRN-Site/sdk/). Use `127.0.0.1` for the iOS Simulator and `10.0.2.2` for
the Android Emulator.

The SDK listener remains loopback-only until **Allow LAN connections** is enabled. Physical devices
must complete the existing [pairing flow](/PulseRN-Site/connections/). Plain `ws://` LAN traffic is
not encrypted; configure PulseRN TLS on networks you do not fully trust.

## Command options

Homebrew users pass options to `pulsern`; npx users append them after the package name:

```bash
pulsern --no-open
pulsern --port 3001
npx @maahibhama/pulsern --help
```

```text
--port <number>          Browser/API port; default 3000
--sdk-port <number>      SDK ingestion port; default 9090
--metro-host <hostname>  Metro host; default 127.0.0.1
--metro-port <number>    Metro port; default 8081
--host <address>         Browser bind address; default 127.0.0.1
--data-dir <path>        Override persistent data directory
--no-open                Do not open the browser
--reset-browser-token    Revoke saved browser sessions
```

The CLI never silently changes a busy port. Stop the conflicting process or choose another browser
port with `--port`; use `--sdk-port` for SDK ingestion and configure the React Native client to
match.

## Security

The browser endpoint binds to loopback and uses an authenticated browser session by default. Passing
`--host 0.0.0.0` exposes the interface to the local network and should only be used on a trusted
development network.

Application events, storage values, and retained sessions can contain sensitive development data.
Keep SDK redaction enabled, avoid secrets in free-form strings, and review [PulseRN's security
model](/PulseRN-Site/security/) before enabling LAN access.

## Persistence and updates

The CLI stores SQLite history, settings, trusted devices, themes, fonts, and TLS credentials in the
platform-specific PulseRN web data directory printed at startup. Browser and Electron data
directories are intentionally separate; use [session archives](/PulseRN-Site/session-archives/) to
move history between them.

Homebrew installations update with `brew update && brew upgrade pulsern-cli`. To run the newest npm
release explicitly, use:

```bash
npx @maahibhama/pulsern@latest
```

Electron's native updater and launch-at-login controls are intentionally hidden in the browser
edition.
