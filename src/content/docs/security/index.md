---
title: Security
description: PulseRN’s local trust model, redaction guarantees, and vulnerability reporting policy.
---

## Report a vulnerability

Report vulnerabilities privately to the repository maintainers. Do not open a public issue containing an exploit, secret, or captured session.

## Current security posture

- The event WebSocket listens on `127.0.0.1` unless authenticated LAN access is explicitly enabled.
- LAN mode requires a short-lived one-time pairing code or a trusted reconnect token. Reconnect
  token hashes are stored with user-only permissions and can be revoked per device.
- LAN handshakes validate the Host header and reject mismatched browser origins.
- Optional TLS uses a user-supplied PEM certificate and matching private key. Key material remains
  in the privileged desktop or CLI process and is never exposed through the renderer.
- Electron uses context isolation, disables Node integration, and sandboxes the renderer.
- Preload exposes narrow validated operations rather than raw Electron IPC or Node APIs.
- The browser edition binds its interface to loopback by default and establishes an authenticated
  browser session through a one-time setup address. Saved browser sessions can be revoked.
- Network, protocol, storage, debugger, and preferences input is validated.
- Frames, batches, queues, payloads, storage requests, and error context are bounded.
- Structured fields, network headers, URL queries, Redux state, navigation parameters, and custom metadata support redaction before transmission.
- Binary network bodies are excluded; captured text and JSON bodies are size-limited.
- Storage mutations require explicit confirmation, and redacted JSON cannot be updated.
- Storage audit events never include stored values.
- Remote content, arbitrary navigation/window opening, and `eval` are disallowed.
- MCP access is disabled by default, uses a local authenticated socket or named pipe, supports
  read-only/debugger/full access modes, bounds and rate-limits sensitive operations, and records a
  sanitized audit log.
- Desktop updates remain in Electron main, never auto-download, require explicit installation
  confirmation, and are disabled in development and ineligible unsigned builds.

Free-form error messages and stack strings cannot be safely field-redacted. Applications must not embed secrets in them.

## LAN and TLS boundary

Do not expose the LAN port to the public internet. Without TLS, LAN transport is plain `ws://` and
must stay on a trusted development network because observers can capture traffic and pairing
credentials. TLS encrypts transport but does not replace pairing.

Review [Connections and secure pairing](/PulseRN-Site/connections/), [privacy and redaction
guidance](/PulseRN-Site/guides/#protect-sensitive-data), and
[Architecture](/PulseRN-Site/architecture/) when changing trust boundaries.
