---
title: Architecture
description: PulseRN package boundaries, event flow, persistence, and session identity.
---

PulseRN is a pnpm/Turborepo monorepo. Its versioned wire contract is independent of Electron and React Native, and every runtime boundary validates unknown input.

## Package responsibilities

- `apps/desktop`: Electron main/preload/renderer, connection server, persistence, and OS integration.
- `apps/example-react-native`: Expo development-build example.
- `apps/example-react-native-cli`: bare Community CLI example.
- `packages/protocol`: message types, schemas, negotiation, and JSON decoding.
- `packages/sdk`: client transport, instrumentation, integrations, and bundled protocol runtime.
- `packages/shared`: runtime-neutral IDs and recursive redaction.

## Event data flow

```text
React Native SDK
  → batch + redact + sequence
  → ws://127.0.0.1:9090
  → parse JSON as unknown
  → Zod validation + negotiation
  → SQLite transaction + session projection
  → validated Electron IPC snapshot
  → Zustand renderer store
  → timeline and details
```

Electron main is the trusted boundary. The renderer is sandboxed with context isolation and no Node integration. Preload exposes narrow, typed operations rather than raw IPC.

## Debugger and settings

The Hermes debugger is a separate Electron-main connection through Metro’s loopback Chrome DevTools Protocol proxy. Main validates discovery and messages, resolves source maps, and sends only narrow debugger commands and snapshots across preload.

Preferences cross validated IPC and are atomically stored with user-only permissions under Electron’s platform `userData` directory.

## Storage and persistence

SQLite uses WAL mode and batched transactions. The renderer currently consumes a small in-memory projection; pagination and virtualization are planned for higher-volume sessions.

Storage commands travel from renderer IPC through Electron main to one negotiated SDK connection. The SDK dispatches them only to registered providers and returns bounded results.

## Session model

Configuration creates a device ID and session ID. A connection ID represents one WebSocket lifetime. Reconnection preserves the configured device/session identity and receives a new connection ID.

Read the [protocol reference](/reference/) for event limits and [security](/security/) for the trust model.
