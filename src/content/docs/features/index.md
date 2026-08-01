---
title: Inspectors and features
description: Explore PulseRN's timeline, inspectors, diagnostics, debugger, connections, and local developer tools.
---

PulseRN correlates React Native development signals in one chronological workspace. Live views stay
bounded while cursor-paginated inspectors load retained history from SQLite.

## Unified timeline

The timeline combines every event category with database-backed filters, saved views, bookmarks,
annotations, parent/correlation links, keyboard navigation, and **Follow Latest**. Clearing the
visible projection does not delete stored history; permanent deletion is a separate confirmed
operation.

Read [Timeline and sessions](/PulseRN-Site/timeline/) for session identity, retention, and archive
workflows.

## Console

PulseRN intercepts `log`, `info`, `warn`, `error`, and `debug` while preserving the original console
calls.

The Console inspector provides:

- consecutive repeat collapsing with session boundaries and timestamp ranges;
- level and source presets;
- multiline message and stack search;
- lazy, bounded structured values;
- source grouping, source links, and stack inspection;
- redaction and truncation indicators;
- configurable 250–2,000 record display windows;
- console-specific rate-limit and transport-drop diagnostics.

Capture rate, object depth, property count, and string length are configurable. Calling
`disconnect()` restores the original console methods.

## Network

Global fetch and XMLHttpRequest instrumentation records request lifecycle events without consuming
the response stream. An optional Axios interceptor supports custom adapters.

The Network inspector includes:

- in-flight progress, completion, failure, and redirect chains;
- initiators, correlation IDs, and an approximate waterfall;
- status, method, URL, header, query, and body search;
- lazy request and response body views;
- sanitized copy-as-cURL and HAR export;
- per-body, per-request, and per-session capture budgets.

Binary bodies are excluded. Text and JSON bodies are bounded and redacted before transport.
Fine-grained DNS, connection, or transfer phases are shown only when the runtime actually provides
them.

## Redux

The Redux/Redux Toolkit middleware observes dispatch without mutating application state. It supports:

- multiple independently filterable stores;
- bounded action, previous-state, and next-state capture;
- lazy structured trees and searchable path-based diffs;
- changed-path summaries and reducer duration;
- state-size warnings and circular/oversized-state handling;
- per-store categories and action allow/deny patterns;
- optional route, request, error, performance, and parent-flow correlation.

State replay, action dispatch, and time travel are intentionally not implemented.

## Navigation

React Navigation, Expo Router, and manual tracking are normalized into a common history. PulseRN
records complete route paths, lifecycle, previous/current routes, time on screen, parameter changes,
and nested navigator ownership.

The inspector shows:

- forward, back, and reset action groups;
- route and screen-duration history;
- parameter diffs with redaction;
- a flat ownership tree using stable navigator IDs;
- integration metadata and tracking-quality warnings;
- links to related request, Redux, performance, console, and error events.

Duplicate navigator IDs, missing route keys, incomplete tracking, and inconsistent ancestry produce
explicit warnings.

## Performance

PulseRN captures JavaScript-derived FPS, event-loop lag and stalls, startup and screen milestones,
custom marks/measures, and heap usage when the runtime exposes it.

The Performance inspector adds:

- bounded virtualized time-series views and selectable ranges;
- configurable JS FPS, stall, slow-screen, network-latency, and memory-growth thresholds;
- matching-session baselines when compatible history is loaded;
- sampling interval, lost-sample, and capture-rate visibility;
- correlated slow-operation context.

Values are labeled with their JavaScript/runtime provenance. PulseRN does not substitute synthetic
numbers for unavailable native CPU, UI-thread, GPU, or native-memory metrics.

## Storage

Registered AsyncStorage, MMKV, and custom providers expose their capabilities before use. The
Storage inspector supports:

- 100-key cursor pagination and search;
- lazy, typed value loading;
- provider-aware update and delete validation;
- read-only persisted snapshots and comparisons;
- confirmed mutations and an opaque one-use, same-session undo;
- local mutation audit metadata;
- explicit export of selected safe values.

Redacted, binary, sensitive, missing, or unavailable values cannot be snapshotted or exported.
Redacted JSON cannot be edited. Storage audit events never contain stored values.

## Errors

PulseRN captures uncaught JavaScript errors, unhandled rejections, React error boundaries, handled
application failures, network failures, SDK errors, and debugger/connection/desktop failures.

The Errors inspector provides:

- stable fingerprints and grouped occurrences;
- first/last seen and affected-version tracking;
- cross-version regression state;
- parsed JavaScript and React component frames;
- application, SDK, debugger, connection, and desktop ownership classification;
- route, request, Redux, console, and performance context;
- re-redacted Markdown and JSON issue reports.

Issue reports are generated locally and are never uploaded automatically.

## JavaScript and React debugger

The Hermes debugger supports original sources, source quick-open, dependency blackboxing,
breakpoints, stepping, lazy scopes, watches, inline/hover values, and a live evaluation console.

The React workbench adds a read-only component tree, props/state/hooks/styles/accessibility
inspection, changed-value markers, owner navigation, render timing, optional on-device highlighting,
element picking, and bounded JavaScript render profiling.

See the complete [JavaScript debugger guide](/PulseRN-Site/debugger/).

## Automatic diagnostics

PulseRN can deterministically identify application errors, network failures, preceding Redux or
navigation activity, performance anomalies, and transport degradation. Findings contain confidence,
explicit relations, evidence, source context when available, and completeness warnings.

See [Automatic diagnostics](/PulseRN-Site/diagnostics/).

## MCP debugger

The bundled local MCP server connects Codex, Claude, Cursor, and other compatible clients to
PulseRN. Configurable read-only, debugger, and full modes control whether a client can only inspect
history, control Hermes, evaluate JavaScript, or mutate storage.

See [MCP debugger](/PulseRN-Site/mcp/).

## Connections, archives, settings, and updates

PulseRN also includes:

- live transport-health diagnostics and connected-device history;
- opt-in physical-device LAN access with one-time pairing and revocable reconnect credentials;
- optional user-provided TLS;
- compressed, checksummed, duplicate-safe session import/export;
- system/light/dark themes, density, ordering, motion, retention, capture, privacy, debugger, and
  connection preferences;
- first-run SDK/device/Metro/Hermes/event checks;
- stable/beta update channels with explicit download and confirmed install in eligible signed builds.

Continue with [Connections and pairing](/PulseRN-Site/connections/),
[Session archives](/PulseRN-Site/session-archives/), or
[Troubleshooting](/PulseRN-Site/troubleshooting/).
