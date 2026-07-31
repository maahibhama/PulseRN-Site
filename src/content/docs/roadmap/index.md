---
title: Roadmap
description: Completed PulseRN phases and the next foundation-hardening priorities.
---

## Completed

1. **Foundation:** monorepo, secure Electron shell, protocol, transport, SDK, sessions, SQLite, examples, and initial UI.
2. **Console:** safe interception, serialization, stacks, filters, search, pause, clear, expansion, and copy.
3. **Network:** fetch/XHR/Axios capture, redaction, truncation, timing, filters, and inspector details.
4. **Redux:** middleware, action/state/diff capture, timing, redaction, filters, and multiple stores.
5. **Navigation:** React Navigation integration, nested routes, timing, redacted parameters, and manual tracking.
6. **Performance:** approximate JS FPS/lag/stalls, startup and screen timing, heap samples, and custom marks.
7. **Storage:** AsyncStorage and MMKV providers, discovery, search/read, redaction, and confirmed mutations.
8. **Errors:** global and boundary failures, stacks, screen attribution, and preceding timeline context.
9. **JavaScript debugger:** Hermes discovery, original sources, breakpoints, stepping, frames, scopes, watches, evaluation, and exception pausing.

## Next priorities

Before higher-volume instrumentation, PulseRN plans to harden the foundation with:

- Database pagination and renderer virtualization
- Authenticated optional LAN binding
- SDK identity persistence
- Electron end-to-end coverage
- Signing and notarization before a stable desktop release

The roadmap describes direction, not a release commitment. Follow [GitHub issues](https://github.com/maahibhama/PulseRN/issues) for current proposals.
