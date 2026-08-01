---
title: Connections and secure pairing
description: Connect simulators, emulators, USB devices, and physical devices to PulseRN.
---

PulseRN listens on `127.0.0.1:9090` by default. Loopback is the simplest and safest path for
simulators, emulators, and USB port forwarding.

## Local connections

| Target           | SDK host    | Additional setup                |
| ---------------- | ----------- | ------------------------------- |
| iOS Simulator    | `127.0.0.1` | None                            |
| Android Emulator | `10.0.2.2`  | None                            |
| Android over USB | `127.0.0.1` | `adb reverse tcp:9090 tcp:9090` |

Open **Connections** to see connected devices, trust state, session identity, queue depth, dropped
events, reconnect attempts, socket-buffer pressure, clock offset, and disconnect history.

## Pair a physical device

1. Open **Settings → Connections** and enable authenticated LAN access.
2. Open **Connections** and choose **Create pairing code**.
3. Configure the SDK with the computer's LAN address and the displayed one-time code.
4. Start the application before the code expires.

```ts
ReactNativeDevTool.configure({
  host: "192.168.1.20",
  port: 9090,
  appName: "MyApp",
  pairingCode: "ABCD-EFGH",
  onReconnectToken(token) {
    // Store this in application-owned development secure storage.
    savePulseRNReconnectToken(token);
  },
}).connect();
```

Pairing codes have configurable 1–30 minute lifetimes and 1–20 allowed attempts. A successful
pairing returns a high-entropy reconnect token once. Store it outside source control and supply it
on later launches:

```ts
ReactNativeDevTool.configure({
  host: "192.168.1.20",
  appName: "MyApp",
  reconnectToken,
}).connect();
```

Trusted credentials are stored as hashes by the desktop app. Revoke a device from **Connections** at
any time; it must pair again before reconnecting over LAN.

## Optional TLS

Without TLS, LAN traffic uses plain `ws://` and should stay on a trusted development network. To use
`wss://`:

1. Create or obtain a PEM certificate and matching private key.
2. Ensure the certificate's subject alternative names include the hostname or IP used by the app.
3. Install trust for the issuing certificate authority on the device.
4. Select both files in **Settings → Connections**.
5. Set `secure: true` in the SDK.

TLS encrypts transport but does not replace pairing authentication. If persisted TLS configuration
becomes invalid, PulseRN falls back to loopback instead of unexpectedly exposing a plaintext LAN
listener.

Never expose port `9090` to the public internet or commit pairing codes, reconnect tokens,
certificates containing private material, or TLS private keys.
