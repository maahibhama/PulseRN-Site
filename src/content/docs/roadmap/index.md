---
title: Roadmap
description: Completed PulseRN foundations and implemented features awaiting native acceptance.
---

## Accepted phases

Phases 1–22 are complete and accepted:

1. Secure Electron foundation, protocol, WebSocket transport, SDK, sessions, SQLite, and examples.
2. Console, network, Redux, navigation, performance, storage, error, and Hermes inspectors.
3. Scalable SQLite migrations, cursor pagination, bounded renderer windows, virtualization, transport
   health, and 100,000-event acceptance coverage.
4. Connection diagnostics, session lifecycle, one-time LAN pairing, revocable trusted devices, Host
   and Origin validation, optional TLS, and disconnect history.
5. Database filters, saved timeline views, bookmarks, annotations, keyboard navigation, Follow
   Latest, correlations, and checksummed archives.
6. Deeper category analysis: network lifecycles and export, bounded Redux diffs, normalized
   navigation, performance baselines, storage snapshots/undo/audits, and grouped error regressions.
7. Settings, accessibility, first-run onboarding, persisted SDK identity, typed configuration,
   category sampling, dropped-event callbacks, package-format validation, and deterministic example
   labs.

## Implemented, acceptance pending

The following work is implemented but still awaits its native release or device acceptance gate:

- **Distribution:** credential-gated Apple signing/notarization and Windows Authenticode, stable/beta
  update protection, cross-platform artifacts, checksums, SPDX SBOMs, architecture reports, and
  provenance attestations. Final acceptance requires a complete tag-driven native release candidate.
- **Debugger workbench:** selected-frame hover values, bounded live REPL, lazy nested objects, scope
  completion, safer getter behavior, persisted workbench preferences, and remote-object cleanup.
- **React component inspector:** searchable Fiber hierarchy, props/state/hooks/style/accessibility
  details, source navigation, stable selection, changed-value markers, render counts, and owner
  navigation.
- **React profiler:** point-in-time render ranking and bounded JavaScript Fiber timing capture.
- **Interactive inspection:** capability-gated on-device highlighting and React Native element
  picking with a safe read-only fallback.

React prop/state mutation remains deferred until a versioned React DevTools backend bridge can
provide it without relying on unstable host-view internals.

The roadmap describes direction and acceptance state, not a release commitment. Follow
[GitHub issues](https://github.com/maahibhama/PulseRN/issues) and release notes for current status.
