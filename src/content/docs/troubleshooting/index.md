---
title: Troubleshooting
description: Diagnose connection, capture, debugger, storage, and installation problems.
---

## No device appears

1. Confirm PulseRN is open and listening on the same port configured in the SDK.
2. Confirm `configure(...).connect()` runs in the development build.
3. Use `127.0.0.1` for iOS Simulator or `10.0.2.2` for Android Emulator.
4. For USB Android, run `adb reverse tcp:9090 tcp:9090`.
5. Inspect `client.getDiagnosticSummary()` and PulseRN's **Connections** view.

`allowInProduction` defaults to `false`. Leave it disabled and do not test the integration with a
production build.

## A physical device cannot connect

- Enable authenticated LAN access in **Settings → Connections**.
- Use the computer's reachable LAN IP, not `127.0.0.1`.
- Create a new one-time pairing code if the previous one expired or exhausted its attempts.
- Revoke and pair again if a stored reconnect token is no longer trusted.
- Keep the phone and computer on the same trusted network.
- Do not expose the debugger port through router port forwarding.

For `wss://`, verify the device trusts the certificate authority and that the certificate covers the
exact hostname or IP used by the SDK.

## Events are missing

- Check that the category is enabled in both SDK configuration and the current saved view.
- Inspect category sampling and `onDroppedEvent`.
- Review queue, payload-budget, console-rate-limit, network-session-budget, and socket-buffer
  diagnostics in **Connections**.
- Confirm an integration is registered before `connect()`.
- Clear temporary inspector filters without permanently deleting history.

## Network events are duplicated

Global fetch/XHR instrumentation can already observe requests made through Axios. Do not also attach
the Axios interceptor unless the custom adapter requires it or duplicates are acceptable.

## The JavaScript debugger cannot attach

- Confirm React Native 0.76 or newer and a Hermes development runtime.
- Confirm Metro is running locally on the port configured in **Settings → Debugger**.
- Refresh targets after rebuilding or restarting Metro.
- Close React Native DevTools if PulseRN reports HTTP 401 or another debugger owning the runtime.
- Remember that only one Hermes target is supported at a time.

The SDK event connection may work even when the independent Metro debugger connection does not.

## Original sources or component data are unavailable

Original sources require valid source maps from Metro. Component inspection additionally depends on
the React DevTools backend exposed by the current React Native development runtime. Unsupported
interactive features are capability-gated; use the read-only tree or generated source when needed.

## Storage cannot be edited

- Confirm `enableStorage: true` and register the provider before connecting.
- Some providers or values are intentionally read-only.
- Redacted JSON and binary values cannot be edited.
- Update and delete operations require confirmation in PulseRN.
- Undo is opaque, held by the SDK, and available only once during the same connected session.

## Port 9090 is occupied

Stop the conflicting process or choose the same alternate port in PulseRN Settings and SDK
configuration. Browser-edition users can pass `--sdk-port <number>` and must configure the SDK to
match. Restart PulseRN after changing the port.

## Browser port 3000 is occupied

The CLI does not silently select another port. Stop the conflicting process or choose one explicitly:

```bash
npx @maahibhama/pulsern --port 3001
```

## Installer or update warnings

Unsigned preview builds can trigger macOS Gatekeeper or Windows SmartScreen. Verify the downloaded
artifact against `SHA256SUMS.txt`. Automatic update installation is disabled in development and
unsigned builds; use a newer direct installer when necessary.
