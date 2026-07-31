---
title: Inspectors and features
description: Understand the PulseRN timeline, inspectors, storage tools, and Hermes debugger.
---

PulseRN correlates debugging signals in one chronological timeline. The latest 2,000 events are retained in the renderer’s in-memory projection in the current phase.

## Console

Captures `log`, `info`, `warn`, `error`, and `debug` while preserving the original console calls. Filter, search, pause, clear, expand payloads, copy values, and inspect source locations and stacks.

## Network

Inspects fetch and XMLHttpRequest, with optional Axios interception. Filter by status or method, search URLs, highlight failures, and inspect headers, request/response bodies, timings, and errors. Binary bodies are excluded and text bodies are bounded.

## Redux

The Redux/Redux Toolkit middleware records sanitized actions, optional previous and next state, path-based diffs, and reducer duration. Multiple `storeId` values remain independently filterable. State replay and time travel are not implemented.

## Navigation

React Navigation tracking records ready, state, focus, and blur events, resolves nested routes, redacts parameters, and measures time on the previous route. A manual API supports Expo Router and custom navigation systems.

## Performance

PulseRN estimates JavaScript FPS, event-loop lag and stalls, startup/screen milestones, custom measures, and available heap metrics. These JavaScript-derived values are not native UI-thread, CPU, or memory profiling.

## Storage

Registered AsyncStorage and MMKV providers support discovery, search, read, refresh, update, and delete. Updates and deletes require explicit confirmation. Redacted JSON cannot be edited, and MMKV binary values appear as read-only size markers.

## Errors

Captures uncaught JavaScript errors, unhandled rejections, React error boundaries, network failures, SDK errors, and manually reported failures. Events can include the active screen and up to 20 preceding sanitized timeline summaries.

## JavaScript debugger

The Sources debugger attaches to one Hermes development runtime through Metro. React Native 0.76 or newer is required.

1. Run Metro and the development build on the same computer as PulseRN.
2. Set the Metro port in **Settings → JavaScript debugger** if it is not `8081`.
3. Open **Debugger**, refresh targets, and select the Hermes runtime.
4. Close React Native DevTools if Metro rejects the connection.

Use `F8` to resume/pause, `F10` to step over, `F11` to step in, and `Shift+F11` to step out. PulseRN supports original TypeScript sources, conditional breakpoints, call frames, scopes, watches, evaluation, and exception pausing.

Production builds, JavaScriptCore, native-code debugging, simultaneous targets, source editing, and logpoints are not supported.

## Troubleshooting

If events are missing, verify the relevant SDK option is enabled and the integration registered before `connect()`. For debugger failures, confirm Metro is loopback-accessible and no other debugger owns the runtime.
