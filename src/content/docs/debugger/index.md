---
title: JavaScript debugger
description: Debug Hermes sources, inspect paused values, explore React components, and profile renders.
---

PulseRN attaches its native debugger to one React Native Hermes development runtime through Metro.
React Native 0.76 or newer is required. The event connection on port `9090` is independent and keeps
feeding the other inspectors while the debugger is attached.

## Connect

1. Start Metro and the development build.
2. Set the Metro port in **Settings → Debugger** if it is not `8081`.
3. Open **Debugger**, refresh targets, and select the Hermes runtime.
4. Close React Native DevTools if PulseRN reports HTTP 401 or a conflicting debugger.

Metro and PulseRN must run on the same computer. Debugger discovery remains restricted to loopback,
even when an SDK device uses authenticated LAN pairing.

## Sources, breakpoints, and stepping

PulseRN resolves original TypeScript and JavaScript sources through source maps. Use `Cmd/Ctrl+P`
for quick source search, browse the path hierarchy, and blackbox dependencies when the runtime
supports it.

Click a line-number gutter to add a normal breakpoint:

- Shift-click adds a conditional breakpoint.
- Cmd/Ctrl-click adds a hit-count breakpoint.
- Option/Alt-click adds a logpoint.

Verified, pending, and hit-count state appears in the breakpoint list. Breakpoints, watches, and
exception-pause preferences persist locally and are restored after Metro or application reloads.
PulseRN makes five bounded reconnect attempts when the active target reloads.

| Action            | Shortcut     |
| ----------------- | ------------ |
| Pause or resume   | `F8`         |
| Step over         | `F10`        |
| Step into         | `F11`        |
| Step out          | `Shift+F11`  |
| Quick-open source | `Cmd/Ctrl+P` |

## Inspect a paused program

When execution pauses, select a call frame and inspect lazily loaded, searchable scopes. Inline
values show near source expressions, and changed values are identified between pauses. Hover an
identifier or property chain to evaluate it in the selected frame without automatically invoking
functions or getters.

The bottom console supports:

- evaluation in the selected call frame or running runtime;
- multiline input with `Shift+Enter`;
- bounded local history with Up/Down;
- scope-based completion with `Cmd/Ctrl+Space`;
- lazy expansion of returned objects.

Application console capture remains in the separate **Console** inspector.

## React component inspector

Open **Components** to view the rendered owner hierarchy exposed by React DevTools Fiber roots.
Depending on runtime capability, PulseRN shows:

- props, class state, hooks, styles, and accessibility metadata;
- source locations, native tags, and current render duration;
- changed props, state, and hooks between snapshots;
- observed render counts and **Rendered by** owner navigation;
- source navigation back to the original debugger.

When supported, hovering highlights the host view on the device and **Select on device** opens React
Native's native inspection overlay. Unsupported versions remain usable in read-only tree mode.
PulseRN does not mutate component props or state.

## React profiler

The **Profiler** workbench can rank a point-in-time component snapshot or record bounded Fiber timing
samples. Results describe JavaScript and React render work, not native CPU, UI-thread, GPU, or
native-memory performance.

## Current limitations

Production bundles, JavaScriptCore, native Swift/Kotlin/C++ code, simultaneous targets, source
editing, and guaranteed component metadata in optimized bundles are not supported.
