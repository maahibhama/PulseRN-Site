---
title: Security
description: PulseRN’s local trust model, redaction guarantees, and vulnerability reporting policy.
---

## Report a vulnerability

Report vulnerabilities privately to the repository maintainers. Do not open a public issue containing an exploit, secret, or captured session.

## Current security posture

- The event WebSocket listens only on `127.0.0.1`.
- Electron uses context isolation, disables Node integration, and sandboxes the renderer.
- Preload exposes narrow validated operations rather than raw Electron IPC or Node APIs.
- Network, protocol, storage, debugger, and preferences input is validated.
- Frames, batches, queues, payloads, storage requests, and error context are bounded.
- Structured fields, network headers, URL queries, Redux state, navigation parameters, and custom metadata support redaction before transmission.
- Binary network bodies are excluded; captured text and JSON bodies are size-limited.
- Storage mutations require explicit desktop confirmation, and redacted JSON cannot be updated.
- Storage audit events never include stored values.
- Remote content, arbitrary navigation/window opening, and `eval` are disallowed.

Free-form error messages and stack strings cannot be safely field-redacted. Applications must not embed secrets in them.

## Network boundary

Do not bind the server to a LAN interface until authentication and origin controls are implemented. This is why physical-device connections are not currently supported by the default server.

Review [privacy and redaction guidance](/PulseRN-Site/guides/#protect-sensitive-data) when configuring an application and [Architecture](/PulseRN-Site/architecture/) when changing trust boundaries.
