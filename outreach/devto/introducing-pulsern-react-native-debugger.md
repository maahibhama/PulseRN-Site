---
title: I Built PulseRN—An Open-Source Desktop Debugger for React Native
published: false
description: PulseRN brings React Native logs, requests, state, navigation, performance, errors, Hermes debugging, and MCP workflows into one local-first desktop workspace.
tags: reactnative, debugging, opensource, devtools
cover_image: https://maahibhama.github.io/PulseRN-Site/assets/pulsern-timeline.png
---

Debugging a React Native application often feels less like following a program and more like
reconstructing a crime scene.

A user taps a button. Redux changes. Navigation briefly moves to another screen. A request starts,
an authentication refresh runs, and an error appears. The information exists, but it is divided
between console output, a network inspector, state tools, navigation logs, and a source debugger.

I found myself spending too much time switching tools and rebuilding the order of events from
memory. So I started building **PulseRN**, an open-source desktop debugger designed around a simple
idea:

> A bug is usually a sequence, so the debugger should preserve the sequence.

PulseRN brings React Native debugging signals into one chronological workspace. It supports Expo
development builds and bare React Native applications, runs locally on macOS, Windows, and Linux,
and is available under the MIT license.

![PulseRN desktop debugger showing React Native events in a unified chronological timeline](https://maahibhama.github.io/PulseRN-Site/assets/pulsern-timeline.png)

## Why another React Native debugger?

React Native already has useful debugging tools. The problem I wanted to address was not the absence
of individual inspectors. It was the missing relationship between them.

Consider a checkout failure:

```text
10:14:03  navigation.focus   Checkout
10:14:05  redux.action       checkout/submitted
10:14:05  network.request    POST /orders
10:14:06  network.request    POST /orders → 401
10:14:06  redux.action       auth/refreshRequested
10:14:07  network.request    POST /token → timeout
10:14:07  error.manual       Unable to complete checkout
```

If I only inspect the final error, this looks like a checkout problem. If I only inspect the failed
`POST /orders`, it looks like an API problem.

The complete sequence tells a more useful story: the request failed because the session had expired,
and recovery failed when the token refresh timed out.

That changes the hypothesis, the code I inspect, and the regression test I write.

PulseRN keeps category-specific inspectors, but the timeline is the connective tissue. Events can
carry correlation and parent identifiers, route context, session identity, timestamps, and
monotonic sequence numbers. Explicit relationships take priority over simply assuming that nearby
events are related.

## What PulseRN can inspect

PulseRN currently brings together several parts of the React Native development workflow.

### Console

It captures `log`, `info`, `warn`, `error`, and `debug` while preserving the original console
behavior. Values are serialized defensively, and the desktop app supports filtering, searching,
expansion, source locations, and stack inspection.

### Network

PulseRN instruments `fetch` and `XMLHttpRequest`, with optional Axios integration. You can inspect
methods, URLs, statuses, headers, bounded text or JSON bodies, timings, and errors.

Binary bodies are intentionally excluded, and captured bodies are bounded. Debugging should not
turn a large download into a frozen JavaScript thread.

### Redux

The Redux middleware records sanitized actions, optional previous and next state, path-based diffs,
and reducer duration. Multiple stores can remain independently filterable.

PulseRN does not currently provide Redux state replay or time travel. The goal is to explain the
transition, not pretend to replace every specialized state tool.

### Navigation

React Navigation tracking records ready, state, focus, and blur events, resolves nested routes, and
can measure time spent on the previous route. A manual API supports Expo Router and custom
navigation systems.

Navigation context is especially useful when an error appears after the screen that initiated the
work has already blurred or unmounted.

### Performance

PulseRN can estimate JavaScript FPS, event-loop lag and stalls, startup or screen milestones, custom
measures, and available heap metrics.

These are JavaScript-derived signals. They are not native CPU, UI-thread, GPU, or native-memory
profiling, and the UI labels them accordingly.

### Errors

It captures uncaught JavaScript errors, unhandled rejections, React error boundaries, network
failures, SDK errors, and manually reported failures.

An error can include the active screen and a bounded amount of preceding sanitized timeline context.
That makes the first reproduction more useful, even if I had not set a breakpoint in advance.

### Storage

Registered AsyncStorage and MMKV providers can be searched and inspected from the desktop app.
Updates and deletions require explicit confirmation. Redacted JSON is not editable, and binary MMKV
values remain read-only markers.

## Hermes debugging with original TypeScript

The timeline helps identify where the application story changed. Sometimes the next question still
requires a source debugger:

- Why did this branch use the old token?
- Which caller supplied this value?
- Why did the retry counter increment twice?
- What was in the selected scope before the reducer returned?

PulseRN can attach to one Hermes development runtime through Metro. It supports original TypeScript
and JavaScript sources, normal and conditional breakpoints, stepping, call frames, scopes, watches,
evaluation, and exception pausing.

The common controls are:

| Action            | Shortcut     |
| ----------------- | ------------ |
| Pause or resume   | `F8`         |
| Step over         | `F10`        |
| Step into         | `F11`        |
| Step out          | `Shift+F11`  |
| Quick-open source | `Cmd/Ctrl+P` |

The source debugger and event connection are separate. Timeline capture can continue while the
debugger attaches through Metro.

Current boundaries are explicit: the debugger requires React Native 0.76 or newer and targets a
development Hermes runtime. It does not debug production bundles, JavaScriptCore, native
Swift/Kotlin/C++ code, or simultaneous targets.

## MCP for evidence-backed AI debugging

PulseRN also includes a local Model Context Protocol server for compatible clients such as Codex,
Claude, and Cursor.

The goal is not to give an AI unrestricted access to the application. It is to let a trusted client
request bounded, structured debugging evidence:

```text
Diagnose the newest session and show the evidence for its
highest-confidence failure.
```

Or:

```text
Find failed checkout requests and correlate them with Redux
and navigation events.
```

PulseRN’s deterministic diagnostic engine identifies application errors, failed requests,
performance anomalies, related state or navigation activity, and degraded transport health. It
returns the primary event, supporting relationships, confidence, and information about whether the
scan was complete.

The AI client can then explain the evidence and request specific follow-up details instead of
guessing from an unrestricted log dump.

MCP access is separated into modes:

- **Read-only:** sessions, events, diagnoses, sources, and connection health.
- **Debugger:** read-only tools plus Hermes breakpoints, stepping, frames, scopes, and component
  inspection.
- **Full:** debugger access plus JavaScript evaluation and storage mutations.

I recommend starting with the least-permissive mode that can complete the investigation.

Captured application strings are treated as untrusted data, not AI instructions. MCP is disabled by
default, uses a local authenticated socket or named pipe, rate-limits sensitive operations, and
records a sanitized audit trail.

## Local-first does not mean “automatically safe”

PulseRN’s default event connection stays on loopback, and retained sessions live in a local SQLite
database. No hosted account is required to inspect a development session.

But local tools still need a security model.

The React Native SDK supports configurable redaction before transmission:

```ts
redaction: {
  fields: ["password", "otp", "token"],
  headers: ["authorization", "cookie"],
  queryParameters: ["api_key"],
}
```

Payloads, batches, transport frames, queues, error context, live history, and archives are bounded.
Electron main validates unknown input and owns privileged operations. The renderer is sandboxed with
context isolation and no Node integration, while preload exposes narrow operations instead of raw
IPC.

Structured redaction also has limits. If application code places a secret inside a free-form error
message, log string, or stack string, a field-name rule cannot reliably remove it. Applications
still need to avoid logging secrets.

Physical-device LAN access expands the trust boundary, so PulseRN uses authenticated pairing and
revocable reconnect credentials. Optional TLS encrypts transport but does not replace pairing.

## Getting started

Install the desktop app from the
[PulseRN releases](https://github.com/maahibhama/PulseRN/releases), then add the SDK to a React
Native development project:

```bash
npm install @pulse-rn/sdk
```

Configure it during development startup:

```ts
import { Platform } from "react-native";
import { ReactNativeDevTool } from "@pulse-rn/sdk";

if (__DEV__) {
  ReactNativeDevTool.configure({
    host: Platform.OS === "android" ? "10.0.2.2" : "127.0.0.1",
    port: 9090,
    appName: "MyApp",
    enableConsole: true,
    enableNetwork: true,
    enableErrors: true,
    redaction: {
      fields: ["password", "token"],
    },
  }).connect();
}
```

Start PulseRN before launching the app, then generate a console message or network request. The
connected development session and its events should appear in the timeline.

Use `127.0.0.1` for the iOS Simulator and `10.0.2.2` for the Android Emulator. For an attached
Android device, reverse the event port:

```bash
adb reverse tcp:9090 tcp:9090
```

The complete [getting-started
guide](https://maahibhama.github.io/PulseRN-Site/getting-started/) covers installation, connection
options, and common troubleshooting.

## What I am building next

PulseRN is actively developed, and I am keeping the work public. The current roadmap includes
continued improvements to retained-session workflows, debugger depth, diagnostics, compatibility,
and the overall developer experience.

I also want the limitations to remain visible. A useful debugger should make it clear which evidence
it captured, what was truncated or dropped, and which parts of the React Native system require
another tool.

## I would value your feedback

PulseRN began with my own frustration around fragmented debugging context, but it will become more
useful only through real React Native workflows.

If you work with React Native, I would love feedback on:

- which debugging signals you need together most often;
- where your current workflow loses context;
- which React Native, Expo, state, or navigation configurations should be tested next;
- whether the installation and connection flow is clear;
- which limitations would prevent you from using it.

You can explore the source, report an issue, or contribute on
[GitHub](https://github.com/maahibhama/PulseRN).

If you try it, tell me what breaks. That is exactly what a debugger—and an open-source project—is
for.
