---
title: Architecture
description: PulseRN package boundaries, event flow, persistence, and session identity.
---

PulseRN is a pnpm/Turborepo monorepo. Its versioned wire contract is independent of Electron and React Native, and every runtime boundary validates unknown input.

## Package responsibilities

- `apps/desktop`: Electron main/preload/renderer, connection server, persistence, and OS integration.
- `packages/cli`: authenticated local browser server, Node.js lifecycle, and published CLI entry point.
- `apps/example-react-native`: Expo development-build example.
- `apps/example-react-native-cli`: bare Community CLI example.
- `packages/protocol`: message types, schemas, negotiation, and JSON decoding.
- `packages/sdk`: client transport, instrumentation, integrations, and bundled protocol runtime.
- `packages/shared`: runtime-neutral IDs and recursive redaction.

## Event data flow

```text
React Native SDK
  → validate + sample + redact + batch + sequence
  → ws://127.0.0.1:9090 or authenticated ws(s):// LAN
  → parse JSON as unknown
  → Zod validation + negotiation
  → SQLite transaction + session projection
  → cursor-paginated validated Electron IPC or authenticated local browser API
  → Zustand renderer store
  → bounded virtualized timeline and inspectors
```

Electron main is the trusted boundary in the desktop edition. The renderer is sandboxed with
context isolation and no Node integration, and preload exposes narrow, typed operations rather than
raw IPC. In the browser edition, the local CLI process owns networking, validation, persistence,
settings, and debugger services while the authenticated loopback interface consumes bounded API
responses.

## Debugger and settings

The Hermes debugger is a separate Electron-main connection through Metro’s loopback Chrome DevTools
Protocol proxy. Main validates discovery and messages, resolves source maps, negotiates optional
capabilities, restores debugger state after reloads, and sends only narrow commands and snapshots
across preload. React component inspection reads development-only Fiber roots through this same
connection and remains read-only.

Preferences cross a validated desktop IPC or local browser API boundary and are atomically stored
with user-only permissions. Electron and browser editions intentionally use separate data
directories.

## Storage and persistence

SQLite uses WAL mode, ordered migrations, batched transactions, and configurable count/age
retention. The renderer consumes a bounded 2,000-event live projection; database filters, cursor
pagination, and virtualization serve retained history. Bookmarks and annotations are stored
separately from immutable captured events.

Storage commands travel from renderer IPC through Electron main to one negotiated SDK connection. The SDK dispatches them only to registered providers and returns bounded results.

## Session model

Configuration creates a device ID and session ID. A connection ID represents one WebSocket lifetime.
Reconnection can preserve configured device/session identity and receives a new connection ID.
Optional SDK helpers persist identity through an application-owned storage adapter.

Session archives are gzip-compressed, versioned, checksummed, bounded, and imported transactionally.
The MCP bridge uses an authenticated local socket or named pipe and applies a configured access mode
before dispatching narrow database, diagnostic, debugger, or storage operations.

Read the [protocol reference](/PulseRN-Site/reference/) for event limits and
[security](/PulseRN-Site/security/) for the trust model.
