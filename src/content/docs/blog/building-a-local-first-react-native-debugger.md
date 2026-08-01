---
title: What I Learned Building a Local-First React Native Debugger
description: Architecture lessons from building PulseRN around validated runtime boundaries, bounded persistence, sandboxed desktop UI, and durable session identity.
author: Mahendra Bhama
date: 2026-08-02
tags:
  - reactnative
  - architecture
  - opensource
  - devtools
canonical_url: https://maahibhama.github.io/PulseRN-Site/blog/building-a-local-first-react-native-debugger/
cover_image: https://maahibhama.github.io/PulseRN-Site/assets/pulse-rn-light.png
published: false
head:
  - tag: link
    attrs:
      rel: canonical
      href: https://maahibhama.github.io/PulseRN-Site/blog/building-a-local-first-react-native-debugger/
---

Building a developer tool looks straightforward from the interface: receive events, list them, and
show details when someone selects a row.

The difficult decisions sit underneath that list. What owns the protocol? Where is unknown input
validated? How does a reconnect relate to a session? What happens after one hundred thousand
events? Which process may read a private key? How do older SDKs coexist with newer desktop builds?

While building PulseRN, an open-source desktop debugger for React Native, I learned that a useful
local-first tool needs explicit boundaries more than it needs a clever event table.

![The PulseRN desktop application showing React Native debugging data](https://maahibhama.github.io/PulseRN-Site/assets/pulse-rn-light.png)

## Local-first is an architecture, not a slogan

For PulseRN, local-first means the normal debugging path stays between a React Native development
build and a desktop application controlled by the developer. The default event server listens on
loopback. Retained events live in a local SQLite database. There is no hosted account required to
inspect a console message or request.

This gives the system a smaller default trust boundary and makes it useful in projects that cannot
send development data to a third-party service.

It does not mean “local equals safe.” A physical device connection can cross a LAN. A desktop
database can retain sensitive development data. A compromised renderer can misuse privileged
operations. Local-first still needs authentication, redaction, validation, retention, and process
isolation.

The useful definition is operational: identify every place data crosses a boundary and make the
local path work without an external service.

## Give the wire protocol its own home

My first major architectural rule is that the protocol should not belong to the desktop interface or
the React Native SDK.

PulseRN keeps versioned message types, schemas, negotiation, and JSON decoding in a runtime-neutral
protocol package. The SDK and desktop depend on that contract:

```text
React Native SDK
  → redact + serialize + sequence + batch
  → WebSocket transport
  → parse JSON as unknown
  → schema validation + version negotiation
  → persistence and session projection
  → validated desktop interface snapshot
```

This prevents TypeScript types from creating a false sense of safety. A type annotation disappears
at runtime. Data received through a socket is unknown until a runtime schema proves otherwise.

Version negotiation also gives incompatibility a defined outcome. The client sends the versions it
supports; the server selects a compatible version or rejects the connection. Events do not flow
before negotiation succeeds.

Without that handshake, a new field or changed interpretation can corrupt debugging evidence in a
way that looks like an application bug.

## Validate again at privileged boundaries

Validation is not a single gate.

Electron main owns network connections, persistence, preferences, filesystem interactions, and
other privileged work. The renderer is sandboxed with context isolation and no Node integration.
A narrow preload API exposes typed operations.

Even after an event has passed network validation, the snapshot crossing into the renderer should
have a deliberately limited shape. Commands from the renderer—delete history, mutate registered
storage, change a connection setting—must be validated in the other direction.

This leads to a helpful ownership rule:

- **SDK:** observe the application, redact, bound, sequence, and transport.
- **Protocol:** define and validate the wire contract.
- **Electron main:** negotiate, persist, enforce policy, and perform privileged operations.
- **Preload:** expose narrow, typed capabilities.
- **Renderer:** present state and request allowed operations.

When ownership is unclear, behavior leaks into whichever layer is easiest to edit. Over time that
creates raw IPC, duplicate validation, and UI code that assumes trusted data.

## Sequence numbers matter more than perfect clocks

Timestamps are essential for a debugging timeline, but device clocks are not a complete ordering
system. They can differ from the desktop clock or change during a session.

Each PulseRN event includes a monotonic session sequence in addition to its timestamp. The sequence
preserves emission order within the session. Optional correlation and parent identifiers express
stronger causal relationships.

I distinguish three identities:

- A **device ID** represents a development installation.
- A **session ID** represents an application-defined run.
- A **connection ID** represents one WebSocket lifetime.

This distinction became important as soon as reconnection worked. A dropped socket should receive a
new connection ID, but it should not automatically fragment one debugging run into unrelated
sessions. Fast Refresh creates similar pressure: network lifetime and developer intent are not the
same thing.

Identity helpers can persist a device and rotate the session at a deliberate lifecycle boundary.
The application remains responsible for defining what that boundary means.

## Persistence needs two views of reality

A live interface wants recent data immediately. A long debugging session wants retained history.
Loading the entire database into UI memory serves neither goal well.

PulseRN uses SQLite with WAL mode and batched transactions for retained events. The renderer consumes
a bounded live projection and requests deterministic cursor pages for older records.

This creates two related but different views:

1. the bounded window that keeps the interface responsive;
2. the retained database that supports history, filters, sessions, bookmarks, and annotations.

“Clear the current view” should not silently mean “delete persisted evidence.” A paused list should
not mean capture stopped. Permanent deletion should be a separate confirmed operation.

Retention is also active behavior, not a settings label. Maintenance runs at known points, removes
expired records, repairs derived counts, and handles malformed stored rows. Limits by age and event
count keep local storage predictable.

## Design for backpressure on day one

A development app can emit events much faster than a human can inspect them. Console loops, render
storms, and large network bodies are often symptoms of the bug, so the worst application behavior
arrives exactly when the debugger is under pressure.

Every stage needs a bound:

- safe serialization limits;
- event payload limits;
- batch and transport-frame limits;
- offline queue limits;
- database transaction sizes;
- live projection limits;
- diagnostic context limits.

Dropping data may sometimes be unavoidable. Hiding that fact is avoidable. Connection diagnostics
and dropped-event counters let developers judge whether the evidence is complete.

Backpressure also changes feature design. A timeline filter backed only by the current in-memory
array gives misleading results for retained sessions. Database-backed filters and deterministic
cursor pagination keep the query model consistent at scale.

## Keep specialized systems separate

The event connection and the Hermes debugger solve different problems.

PulseRN’s source debugger discovers one Hermes development runtime through Metro’s loopback Chrome
DevTools Protocol proxy. It handles source maps, breakpoints, paused scopes, watches, and evaluation.
That connection should not be entangled with the SDK event transport on port `9090`.

Keeping them separate has practical benefits:

- timeline capture can continue while debugger state changes;
- a Metro discovery failure does not erase event history;
- source-debugging requirements can evolve independently from the event protocol;
- security rules can remain specific to each boundary.

The same applies to storage commands and read-only event capture. Storage mutation is a privileged,
confirmed request/response operation, not just another passive event.

## Capability statements need sharp edges

Developer tools are easy to overstate because a partial signal looks like a complete feature.

JavaScript-derived FPS and event-loop lag are not native UI-thread profiling. React render timing is
not device CPU profiling. A component tree can depend on runtime capability. A TypeScript debugger
does not debug native Swift, Kotlin, or C++ code.

I now treat limitations as part of the public interface. They help users choose the right instrument
and prevent the tool from becoming the explanation for evidence it never collected.

The same discipline applies to security. TLS encrypts transport but does not replace pairing.
Configured structured redaction does not sanitize arbitrary strings. A loopback default does not
make optional LAN access harmless.

## Portability improves the system

PulseRN separates the protocol, SDK, shared utilities, desktop application, and example apps into
clear packages. This adds some ceremony, but it also makes assumptions visible.

The protocol cannot import Electron. The SDK cannot depend on renderer state. Shared identifiers and
redaction logic remain runtime neutral. Desktop code has a clear place to own SQLite and operating
system integration.

Package boundaries are not automatically good architecture. They help when each package represents
a stable responsibility and dependency direction.

## The interface is the end of the design

The unified timeline is the visible center of PulseRN, but it works because earlier layers preserve
sequence, identity, relationships, and safe detail. An inspector can only explain a request if the
SDK captured the right boundary, the protocol represented it, validation accepted it, persistence
retained it, and the query returned it consistently.

That is the main lesson I would carry into another developer tool: start with the evidence model and
trust boundaries. The interface will reveal whether those decisions were coherent.

PulseRN is being built in public on
[GitHub](https://github.com/maahibhama/PulseRN). Its [architecture
documentation](https://maahibhama.github.io/PulseRN-Site/architecture/) describes the current package
responsibilities, event flow, persistence model, and session identity in more detail.
