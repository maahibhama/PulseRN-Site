---
title: Debugging Hermes and TypeScript Without Losing Application Context
description: Combine Hermes breakpoints and original TypeScript sources with React Native timeline evidence to understand both the paused line and the surrounding failure.
author: Mahendra Bhama
date: 2026-08-02
tags:
  - reactnative
  - hermes
  - typescript
  - debugging
canonical_url: https://maahibhama.github.io/PulseRN-Site/blog/debugging-hermes-and-typescript/
cover_image: https://maahibhama.github.io/PulseRN-Site/assets/pulse-rn-dark.png
published: false
head:
  - tag: link
    attrs:
      rel: canonical
      href: https://maahibhama.github.io/PulseRN-Site/blog/debugging-hermes-and-typescript/
---

A source debugger gives me something logs cannot: the exact program state at a line before execution
moves on. I can inspect a scope, follow a call stack, test an expression, and step through a branch.

But pausing the program creates a new problem. A line of TypeScript is only one moment in an
application story. Without the navigation, request, state transition, and error that led there, I
can understand the line perfectly and still misunderstand the bug.

My most effective React Native debugging sessions combine Hermes source debugging with
application-level timeline evidence. One answers “what is true here?” The other answers “why did
the application arrive here?”

![PulseRN desktop debugger in its dark interface](https://maahibhama.github.io/PulseRN-Site/assets/pulse-rn-dark.png)

## Understand the moving pieces

In a modern React Native development build, several components cooperate:

- **Hermes** executes the JavaScript bundle and exposes debugging capabilities.
- **Metro** builds the bundle, serves source maps, and exposes the development runtime target.
- **Source maps** connect generated bundle locations to original TypeScript or JavaScript.
- **A debugger client** discovers the runtime and communicates using the supported debugging
  protocol.
- **Your application instrumentation** records higher-level events such as navigation, requests,
  state actions, and handled errors.

These paths are related but not identical. A telemetry connection can keep recording events while a
debugger attaches through Metro. A source-map problem can prevent an original breakpoint from
binding even though the application continues to emit network events.

Separating the paths makes failures easier to diagnose.

## Start from a concrete application event

I rarely begin by browsing the source tree. I begin with a symptom:

- a request has the wrong header;
- a Redux action contains an unexpected value;
- navigation jumps to the wrong route;
- a handled error loses its original cause;
- a render becomes expensive after a particular state change.

I locate the event and identify the code boundary that produced or consumed it. Then I set a
breakpoint close to that boundary.

For a failed request, useful breakpoint locations include:

1. the function that turns state into request options;
2. an authentication interceptor;
3. the response classifier;
4. the reducer or query-cache callback that handles failure.

This event-first approach gives the breakpoint a purpose. I know which values should be present and
which competing hypotheses the pause can resolve.

## Make sure the breakpoint is real

A visible breakpoint marker does not always mean the runtime has bound it.

The debugger maps an original TypeScript line through a source map to a generated location that
Hermes can pause on. If the file is not part of the active bundle, the source map is stale, or the
selected line contains no executable statement, the breakpoint may remain pending.

When a breakpoint does not verify:

- confirm the application loaded the expected development bundle;
- reload after changing Metro or source-map configuration;
- move the breakpoint to a nearby executable statement;
- verify that the displayed source belongs to the selected runtime;
- check whether another debugger already owns the Hermes target.

React Native tooling can also reject a second debugger connection. Close the competing debugger
before assuming the application code is at fault.

## Pause late enough to have context

Breaking too early can be as unhelpful as breaking too late. A breakpoint in a generic request
helper may trigger for analytics, refresh, prefetch, and the operation I care about.

Conditional breakpoints narrow the pause:

```ts
request.url.includes("/orders");
```

A hit-count breakpoint is useful when the error appears on a later retry. A logpoint can record a
targeted value without stopping execution, assuming the runtime supports that behavior.

Conditions should be simple and side-effect free. Do not call application functions or getters just
to decide whether to pause. Evaluating arbitrary code can change the system being observed.

## Read the call stack as a causal path

When execution pauses, I start with the call stack rather than immediately expanding every object.

The stack answers:

- Which public action or effect initiated this work?
- Did the call pass through a retry or cache layer?
- Is the current code running in a success, failure, or cleanup path?
- Did a generic helper erase domain-specific context?

Select the most relevant frame, then inspect its local scope. The top frame contains the current
implementation details, while a caller may contain the intent or domain values that explain them.

Lazy object expansion is valuable here. Large React Native objects, responses, or state trees can be
expensive and noisy. Expand only the branches needed to test the hypothesis.

## Use watches as questions

A watch expression should represent something I expect to remain meaningful across pauses:

```ts
authState.accessTokenVersion;
request.headers.Authorization;
retryAttempt;
navigationRef.getCurrentRoute()?.name;
```

In practice, I avoid expressions that invoke functions unless I understand their behavior. Property
chains and local variables are safer than application calls. Getter evaluation can have side
effects, allocate work, or throw.

I also compare changed values between pauses. If `retryAttempt` increments but the token version
does not, that is stronger evidence than repeatedly scanning the entire scope.

## Step with application boundaries in mind

Stepping controls are simple:

| Action          | Common shortcut |
| --------------- | --------------- |
| Pause or resume | `F8`            |
| Step over       | `F10`           |
| Step into       | `F11`           |
| Step out        | `Shift+F11`     |

The judgment is deciding where to step.

Step into code that transforms the value under investigation. Step over library plumbing that does
not affect the hypothesis. Blackbox dependencies when supported so the call stack stays focused on
application code.

If I find myself stepping through dozens of lines without a question, I resume and improve the
breakpoint. Debugging should reduce the search space, not turn execution into a frame-by-frame film.

## Keep the surrounding timeline visible

Pausing changes time. Requests may time out. The device may wait. Performance measurements become
distorted. Some asynchronous work can continue while the JavaScript thread is paused.

That is another reason to retain the event sequence around the pause:

```text
navigation.focus        Checkout
redux.action            checkout/submitted
network.request         POST /orders started
debugger.paused         request interceptor
network.request         POST /orders completed: 401
error.manual            Checkout failed
```

The timeline tells me what occurred before the pause and what followed after resuming. It also
prevents me from treating debugger-induced timing as normal application performance.

A captured error can include a bounded amount of preceding sanitized context. This is useful when
the breakpoint was not set in advance: the error becomes the starting event for the next
reproduction.

## Source debugging and profiling answer different questions

A JavaScript breakpoint explains control flow and values. It does not measure native UI-thread,
GPU, CPU, or memory behavior.

React component inspection and JavaScript render timing can help identify changed props, state,
hooks, and repeated renders. They still should not be presented as native performance profiling.
React Native performance crosses JavaScript, React reconciliation, the native UI system, networking,
and device resources.

Choose the evidence that matches the claim. “This component rendered 18 times after one action” is
different from “the device dropped native frames because of this component.”

## Know the current boundaries

PulseRN’s Hermes source debugger currently targets a single React Native development runtime through
loopback Metro and requires React Native 0.76 or newer. It supports original sources, breakpoints,
stepping, call frames, scopes, watches, evaluation, and exception pausing.

It does not debug production bundles, JavaScriptCore, native Swift/Kotlin/C++ code, or simultaneous
targets. Source editing is outside its scope. React component metadata can also vary by runtime
capability.

Clear limitations are part of useful tooling. They tell me when to switch to native profilers,
platform debuggers, server traces, or another instrument instead of forcing one tool to answer every
question.

## Combine “where” with “why”

The strongest workflow is:

1. Find the visible symptom in application events.
2. Walk backward to the initiating intent.
3. Form a precise hypothesis about a code boundary.
4. Set a verified breakpoint that distinguishes the alternatives.
5. Inspect the relevant frame and a few deliberate values.
6. Resume and confirm the outcome in the event timeline.
7. Turn the discovered sequence into a regression test.

Hermes and source maps bring me back to the TypeScript I wrote. Timeline context keeps that source
connected to the application the user experienced.

If you want to try the combined workflow, the [PulseRN JavaScript debugger
guide](https://maahibhama.github.io/PulseRN-Site/debugger/) documents setup, shortcuts, supported
capabilities, and current limitations.
