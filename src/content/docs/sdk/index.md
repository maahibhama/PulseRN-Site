---
title: SDK setup
description: Configure PulseRN in Expo development builds and bare React Native applications.
---

All public APIs come from the single `@pulse-rn/sdk` package. No GitHub Packages token is required.

## Install

```bash
npm install @pulse-rn/sdk
# or: pnpm add @pulse-rn/sdk
# or: yarn add @pulse-rn/sdk
```

## Configure the client

```ts
import { Platform } from "react-native";
import { ReactNativeDevTool } from "@pulse-rn/sdk";

if (__DEV__) {
  ReactNativeDevTool.configure({
    host: Platform.OS === "android" ? "10.0.2.2" : "127.0.0.1",
    port: 9090,
    appName: "MyApp",
    enableConsole: true,
    captureConsoleStackTrace: true,
    enableNetwork: true,
    captureRequestBodies: true,
    captureResponseBodies: true,
    maxNetworkBodyBytes: 102_400,
    enableErrors: true,
    enablePerformance: true,
    environment: "development",
    categories: {
      console: true,
      network: true,
      performance: true,
    },
    sampling: {
      performance: 1,
    },
    onDroppedEvent(notice) {
      updateDeveloperDropIndicator(notice);
    },
    redaction: {
      fields: ["password", "otp", "token"],
      headers: ["authorization", "cookie"],
      queryParameters: ["api_key"],
    },
  }).connect();
}
```

Offline events remain in a bounded queue; the oldest event is dropped when it fills. Inspect counts with `client.getStats()`.

Use `validatePulseRNConfig(config)` when configuration must be checked before a client is created.
`client.getDiagnosticSummary()` reports transport health, and
`client.subscribeConnectionState(listener)` drives a developer-only connection indicator.

SDK diagnostics distinguish queue overflow, oversized payloads, category-disabled events, sampling,
console rate limits, network capture budgets, and native socket-buffer pressure.

## Expo and bare React Native

The SDK supports Expo development builds and React Native Community CLI applications. Expo Go works for JavaScript-only capture, but cannot load custom native modules such as MMKV/Nitro. Rebuild the development app whenever native dependencies change.

## Connect a physical device

Enable authenticated LAN access in PulseRN, create a pairing code, and configure the computer's LAN
address:

```ts
ReactNativeDevTool.configure({
  host: "192.168.1.20",
  port: 9090,
  appName: "MyApp",
  pairingCode: "ABCD-EFGH",
  secure: false,
  onReconnectToken(token) {
    saveDevelopmentReconnectToken(token);
  },
}).connect();
```

Use the returned `reconnectToken` on later launches. Set `secure: true` only after configuring TLS
in PulseRN Settings and installing trust for the certificate authority on the device. See
[Connections and secure pairing](/PulseRN-Site/connections/).

## Preserve device and session identity

Use an already-installed storage library to keep device identity stable through application
launches:

```ts
const identity = await getOrCreatePulseRNIdentity(AsyncStorage, {
  lifecycleId: developmentLifecycleId,
});

ReactNativeDevTool.configure({
  appName: "MyApp",
  ...identity,
}).connect();
```

Keep the lifecycle ID stable through Fast Refresh. Change it on a cold launch, logout, or another
application-defined session boundary. `configureWithIdentity` combines identity resolution and
client configuration; `getOrCreatePulseRNDeviceId` is available when only the device must persist.

## Add integrations

### Redux

```ts
const pulseRNMiddleware = createDevToolMiddleware({
  client: ReactNativeDevTool,
  storeId: "main",
  captureState: true,
  captureStateDiff: true,
  redactedFields: ["token", "password"],
});
```

Append it with Redux Toolkit’s middleware callback or pass it to Redux `applyMiddleware`.

### React Navigation

```tsx
const tracker = createNavigationTracker({
  client: ReactNativeDevTool,
  navigatorId: "root",
  redactedFields: ["token", "password"],
});

<NavigationContainer
  ref={navigationRef}
  onReady={() => tracker.onReady(navigationRef)}
  onStateChange={(state) => tracker.onStateChange(state, navigationRef)}
/>;
```

### AsyncStorage

```ts
const client = ReactNativeDevTool.configure({
  appName: "MyApp",
  enableStorage: true,
});
client.registerStorageProvider(createAsyncStorageProvider(AsyncStorage));
client.connect();
```

MMKV v3/v4 uses `createMMKVStorageProvider`. MMKV v4 requires `react-native-mmkv` and `react-native-nitro-modules`.

Provider capabilities determine whether values are readable, writable, removable, snapshot-safe,
or undoable. The desktop validates types and asks for confirmation before mutations.

## Expected result

PulseRN identifies the configured application and enables inspectors for each active integration.

For focused examples, see [Features](/PulseRN-Site/features/) and
[Common workflows](/PulseRN-Site/guides/). For exported symbols and limits, see
[SDK reference](/PulseRN-Site/reference/).
