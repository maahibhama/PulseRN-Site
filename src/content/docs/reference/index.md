---
title: SDK and protocol reference
description: Public SDK entry points, event contracts, connection behavior, and protocol limits.
---

## Public entry points

Import from `@pulse-rn/sdk`:

- `ReactNativeDevTool` and `createPulseRNClient` configure and control a client.
- `validatePulseRNConfig` checks a configuration without creating a connection.
- `getOrCreatePulseRNIdentity` and `getOrCreatePulseRNDeviceId` persist stable development identity
  through an application-owned storage adapter.
- `createDevToolMiddleware` and `diffStates` support Redux inspection.
- `createNavigationTracker`, `getActiveRoute`, and `getActiveRoutePath` support navigation instrumentation.
- `createAsyncStorageProvider` and `createMMKVStorageProvider` register storage.
- `installAxiosInterceptor`, `installErrorInterceptor`, `serializeConsoleValue`, `DevToolClient`,
  `PerformanceMonitor`, and exported configuration/event types support advanced integrations.

`ReactNativeDevTool.configure(config)` returns a client. Call `connect()` after registering any storage providers and `disconnect()` during teardown when appropriate. Production connections remain disabled unless `allowInProduction` is explicitly enabled.

## Protocol

Current protocol version: `1.0.0`.

Clients send `client-hello` containing supported versions, stable IDs, and app/device metadata. The server replies with `server-hello`; event batches are rejected until negotiation succeeds.

Every event includes an ID, protocol version, session/device/app IDs, timestamp, monotonic session sequence, category, type, and JSON payload. Optional `correlationId` and `parentId` relate work across the timeline.

| Category    | Event types                                         |
| ----------- | --------------------------------------------------- |
| Console     | `console.log`, `.info`, `.warn`, `.error`, `.debug` |
| Network     | `network.request`                                   |
| Redux       | `redux.action`                                      |
| Navigation  | `navigation.ready`, `.state`, `.focus`, `.blur`     |
| Performance | `performance.<metric>`                              |
| Storage     | `storage.<operation>` audit events                  |
| Errors      | `error.<source>`                                    |

Storage uses a separate validated request/response channel: `storage-command` and matching `storage-result`.

Additive protocol capabilities include network lifecycle events, transport health, secure pairing
credentials, storage pagination/mutation metadata, deterministic diagnoses, diagnostic snapshots,
source search/context, and MCP access modes.

## Limits

| Boundary                  |        Limit |
| ------------------------- | -----------: |
| WebSocket frame           |        2 MiB |
| Event batch               |   500 events |
| Default event payload     |      256 KiB |
| Default offline queue     | 5,000 events |
| Handshake timeout         |    5 seconds |
| Live renderer window      | 2,000 events |
| Archive compressed size   |      100 MiB |
| Archive decompressed size |      512 MiB |

Invalid JSON and schema-invalid data are logged and discarded by PulseRN's privileged desktop or
CLI process; they never enter the renderer.

## Compatibility

- React Native CLI applications and Expo development builds are supported.
- The Hermes Sources debugger requires React Native 0.76 or newer.
- The SDK event connection defaults to port `9090`; Metro debugging defaults to loopback port `8081`.
- MMKV v4 requires Nitro modules and therefore a native development build.
- Physical devices can use authenticated LAN pairing; TLS is optional and independently configured.
- The MCP bridge supports `read-only`, `debugger`, and `full` access modes.

See [SDK setup](/PulseRN-Site/sdk/) for integration examples,
[Compatibility](/PulseRN-Site/compatibility/) for runtime support, and
[Architecture](/PulseRN-Site/architecture/) for boundary ownership.
