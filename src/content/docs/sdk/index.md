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
    redaction: {
      fields: ["password", "otp", "token"],
      headers: ["authorization", "cookie"],
      queryParameters: ["api_key"],
    },
  }).connect();
}
```

Offline events remain in a bounded queue; the oldest event is dropped when it fills. Inspect counts with `client.getStats()`.

## Expo and bare React Native

The SDK supports Expo development builds and React Native Community CLI applications. Expo Go works for JavaScript-only capture, but cannot load custom native modules such as MMKV/Nitro. Rebuild the development app whenever native dependencies change.

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

## Expected result

The desktop app identifies the configured application and enables inspectors for each active integration.

For focused examples, see [Features](/features/) and [Common workflows](/guides/). For exported symbols and limits, see [SDK reference](/reference/).
