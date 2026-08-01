---
title: Getting started
description: Install PulseRN, connect a React Native development build, and confirm the first events.
---

PulseRN combines a desktop debugger with the `@pulse-rn/sdk` package. The SDK captures development events and sends them to the desktop app’s chronological timeline.

## Prerequisites

- A React Native development build
- Node.js 20.19 or newer when developing PulseRN itself
- PulseRN desktop running on the same computer as Metro

Expo Go cannot load native MMKV integrations; use an Expo development build when your app uses MMKV.

## 1. Install the desktop app

Choose a package from [desktop installation](/PulseRN-Site/installation/) or [GitHub Releases](https://github.com/maahibhama/PulseRN/releases), then open PulseRN. Preview builds are unsigned, so macOS Gatekeeper or Windows SmartScreen may show a warning.

## 2. Add the SDK

```bash
npm install @pulse-rn/sdk
```

Configure it once during development startup:

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
    redaction: { fields: ["password", "token"] },
  }).connect();
}
```

Keep `allowInProduction` at its default value, `false`.

## 3. Run and verify

Start PulseRN before launching the app. Generate a `console.log` or network request. A connected device and its events should appear in the desktop timeline.

Use `127.0.0.1` for the iOS Simulator and `10.0.2.2` for the Android Emulator. For an attached Android device, reverse the port:

```bash
adb reverse tcp:9090 tcp:9090
```

## Troubleshooting

- **No device appears:** confirm PulseRN is open, the port is `9090`, and the app is a development build.
- **Android cannot connect:** use `10.0.2.2` for an emulator or configure `adb reverse` for a USB device.
- **Physical device cannot connect:** LAN binding is intentionally unavailable until authenticated remote connections are implemented.
- **Duplicate network events:** avoid enabling an Axios interceptor for requests already captured by the global fetch/XHR instrumentation.

## Next steps

Continue with the complete [SDK setup](/PulseRN-Site/sdk/), explore the [inspectors](/PulseRN-Site/features/), or review [privacy and redaction](/PulseRN-Site/guides/#protect-sensitive-data).
