# Why I Built PulseRN: React Native Debugging Should Tell the Whole Story

_An open-source, local-first desktop debugger that brings application events, Hermes, and
evidence-backed AI workflows into one chronological workspace._

Debugging a React Native application rarely begins with a clean stack trace and an obvious fix.

It usually begins with a symptom.

A checkout button stops loading. A screen briefly appears and disappears. A request fails only after
the app has been open for an hour. An error message tells you what the user saw, but not where the
problem started.

The evidence is scattered across console output, network requests, state changes, navigation
events, performance measurements, and source code. Each tool shows one part of the application, and
the developer is left to reconstruct the sequence from memory.

I built **PulseRN** because I wanted that sequence to remain intact.

![PulseRN showing React Native events in one chronological timeline](https://maahibhama.github.io/PulseRN-Site/assets/pulsern-timeline.png)

PulseRN is an open-source desktop debugger for React Native. It runs locally on macOS, Windows, and
Linux and works with Expo development builds and bare React Native applications.

Its central idea is simple:

> A bug is usually a sequence of events, so the debugger should preserve the sequence.

## The Problem Wasn’t a Lack of Tools

React Native already has useful tools for inspecting individual signals.

The console tells me what the application logged. A network inspector shows requests and responses.
Redux tooling shows actions and state transitions. Navigation instrumentation tells me which screen
was active. Hermes can pause the JavaScript runtime on an original TypeScript line.

The problem appears when a bug crosses those boundaries.

Consider a failed order:

```text
10:14:03  navigation.focus   Checkout
10:14:05  redux.action       checkout/submitted
10:14:05  network.request    POST /orders
10:14:06  network.request    POST /orders → 401
10:14:06  redux.action       auth/refreshRequested
10:14:07  network.request    POST /token → timeout
10:14:07  error.manual       Unable to complete checkout
```

If I begin with the final error, I might inspect the checkout screen. If I begin with the `401`, I
might blame the API.

The sequence reveals something more specific: the order request encountered an expired session,
and the recovery request timed out.

That is a better hypothesis. It tells me which code path to inspect and which condition should become
a regression test.

## Making the Timeline the Primary Workspace

PulseRN keeps console, network, Redux, navigation, performance, storage, and error events in one
chronological timeline.

This does not mean category-specific inspectors disappear. A network request still needs a detailed
view of its status, headers, timing, and bounded body. A Redux action still needs a state diff. An
error still needs its source frames.

The timeline acts as the connective tissue between those views.

Events can include:

- a stable event identifier;
- device, session, and connection identity;
- a timestamp and monotonic session sequence;
- a correlation identifier for related work;
- a parent identifier for explicit causal relationships;
- active route or application context;
- sanitized, bounded payload data.

Explicit relationships are stronger than time proximity. Two events occurring within the same
second may be unrelated, while a request and an error connected by a parent ID remain related even
when other work happens between them.

## What PulseRN Brings Together

PulseRN currently supports the major signals I repeatedly needed while debugging real React Native
flows.

### Console and network

Console capture supports `log`, `info`, `warn`, `error`, and `debug` while preserving the original
calls. Values are defensively serialized so circular or oversized data does not break the
application.

Network inspection covers `fetch` and `XMLHttpRequest`, with optional Axios integration. It exposes
requests, responses, timings, failures, redirects, initiators, and bounded text or JSON bodies.
Binary bodies are excluded.

### State and navigation

The Redux middleware can capture sanitized actions, selected state, path-based diffs, reducer
duration, and multiple stores.

Navigation tracking records ready, state, focus, and blur events, resolves nested routes, and
measures time on the previous route. It supports React Navigation as well as manual tracking for
Expo Router and custom navigation systems.

Together, these signals answer an important question: what did the application believe was
happening when the request or error occurred?

### Performance and errors

PulseRN can estimate JavaScript FPS, event-loop lag and stalls, startup or screen milestones, custom
measures, and available heap metrics.

These values are deliberately described as JavaScript-derived signals. They are not native CPU,
UI-thread, GPU, or memory profiling.

Error capture includes uncaught JavaScript errors, unhandled rejections, React error boundaries,
network failures, SDK errors, and manually reported failures. An error can carry the active screen
and a bounded set of preceding sanitized timeline summaries.

### Local storage

Registered AsyncStorage and MMKV providers can be searched and inspected. Mutations require
confirmation, redacted JSON cannot be edited, and binary MMKV values remain read-only markers.

Storage inspection is useful, but it crosses a more sensitive boundary than passive event capture.
That is why it has separate capabilities and confirmation behavior.

## From the Timeline to an Original TypeScript Line

A timeline helps me find the first suspicious transition. It does not replace a source debugger.

When I need to know why a request used an old token or why a reducer selected an unexpected branch,
I want to pause execution and inspect the actual values.

PulseRN includes a native Hermes JavaScript debugger that attaches to one development runtime
through Metro. It supports:

- original TypeScript and JavaScript sources;
- normal and conditional breakpoints;
- hit-count breakpoints and logpoints where supported;
- stepping and call frames;
- lazy, searchable scopes;
- watches and evaluation;
- exception pausing;
- source search and quick open.

The source debugger and the event connection are separate. The application can continue feeding
timeline events while the debugger manages its connection through Metro.

The current limitations matter: Hermes debugging requires React Native 0.76 or newer. PulseRN does
not debug production bundles, JavaScriptCore, native Swift/Kotlin/C++ code, or simultaneous targets.

I would rather state those boundaries clearly than imply that one tool can observe every layer of a
mobile application.

## Adding MCP Without Handing Over Everything

PulseRN also includes a local Model Context Protocol server for clients such as Codex, Claude,
Cursor, and other MCP-compatible tools.

The goal is not to give an AI unrestricted access to a development computer. The goal is to expose
structured, bounded debugging evidence through clearly defined operations.

A developer can ask:

```text
Diagnose the newest session and show the evidence for its
highest-confidence failure.
```

Or:

```text
Find failed checkout requests and correlate them with
Redux and navigation events.
```

PulseRN first produces deterministic findings from captured events. It identifies conditions such
as application errors, failed requests, performance anomalies, related state or navigation
activity, and transport problems.

Each finding includes its primary evidence, supporting relationships, confidence, and information
about whether the scan was complete. The AI client can then explain those facts and request focused
follow-up context instead of improvising from an unrestricted log dump.

MCP permissions are divided into read-only, debugger, and full access modes. Full mode can evaluate
JavaScript or mutate registered storage, so it should only be enabled for a trusted local client.

Captured application text is treated as untrusted evidence, never as an instruction to the AI.

## Local-First Still Requires a Security Model

PulseRN’s normal event connection stays on loopback, and retained sessions are stored in a local
SQLite database. A hosted account is not required.

But “local” does not automatically mean safe.

The SDK supports structured redaction before data is queued or transmitted:

```ts
redaction: {
  fields: ["password", "otp", "token"],
  headers: ["authorization", "cookie"],
  queryParameters: ["api_key"],
}
```

Payloads, batches, transport frames, queues, error context, live history, and archives have explicit
bounds. Network and protocol input is validated before it reaches the desktop interface.

The Electron renderer is sandboxed with context isolation and no Node integration. Privileged work
such as networking, persistence, sensitive settings, and storage commands remains in Electron main,
with a narrow preload boundary.

Redaction also has honest limits. A field rule can remove a structured value named `token`, but it
cannot reliably discover a secret embedded inside an arbitrary error message or stack string.
Applications still need to avoid logging secrets.

## Connecting a Development App

Install a PulseRN desktop preview from
[GitHub Releases](https://github.com/maahibhama/PulseRN/releases), then add the SDK:

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

Use `127.0.0.1` for the iOS Simulator and `10.0.2.2` for the Android Emulator. An attached Android
device can reverse the event port:

```bash
adb reverse tcp:9090 tcp:9090
```

Start PulseRN, run the development application, and generate a log or request. The connected session
and its first events should appear in the desktop timeline.

## Building It in Public

PulseRN is open source under the MIT license. The desktop application, React Native SDK, versioned
protocol, examples, documentation, and release workflows are all developed in public.

The project is still evolving. I am especially interested in feedback about:

- debugging signals that need better correlation;
- React Native and Expo configurations that should be tested;
- installation friction across macOS, Windows, and Linux;
- workflows where existing tools lose important context;
- limitations that would prevent adoption on a real project.

My goal is not to build the debugger with the longest feature list. It is to build a debugging
workspace that produces a stronger explanation of what happened.

If you work with React Native, you can explore PulseRN on
[GitHub](https://github.com/maahibhama/PulseRN) and follow the
[getting-started guide](https://maahibhama.github.io/PulseRN-Site/getting-started/).

If you try it, I would genuinely like to hear where it helps—and where it gets in your way.
