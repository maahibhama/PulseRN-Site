---
title: Common workflows
description: Practical recipes for capture, measurements, error context, and safe redaction.
---

## Measure a slow interaction

Enable performance capture, then surround the operation with marks:

```ts
ReactNativeDevTool.performance.mark("checkout-start");
await submitCheckout();
ReactNativeDevTool.performance.mark("checkout-complete");
ReactNativeDevTool.performance.measure(
  "checkout-duration",
  "checkout-start",
  "checkout-complete",
);
```

Use `startScreen`, `screenMounted`, `screenInteractive`, and `endScreen` for screen milestones. Correlate the measurement with nearby network, Redux, and navigation events.

## Capture handled failures

```ts
ReactNativeDevTool.captureError(error, {
  source: "manual",
  metadata: { operation: "checkout" },
});
```

Forward React error-boundary failures from `componentDidCatch` with source `react_boundary` and the component stack.

## Attach an Axios instance

```ts
const removeAxiosInterceptor = ReactNativeDevTool.client?.attachAxios(axios);
```

Call the returned function when disposing the instance. Do not attach it when global instrumentation already captures the same requests unless duplicate events are acceptable.

## Inspect custom storage

```ts
client.registerStorageProvider({
  id: "custom",
  name: "Custom storage",
  getAllKeys: async () => storage.getAllKeys(),
  getItem: async (key) => storage.getString(key) ?? null,
  setItem: async (key, value) => storage.set(key, value),
  removeItem: async (key) => storage.delete(key),
});
```

Provider IDs must be unique within a client.

## Protect sensitive data

Configure redaction before connecting:

```ts
redaction: {
  fields: ['password', 'otp', 'token'],
  headers: ['authorization', 'cookie'],
  queryParameters: ['api_key'],
}
```

Structured values are recursively redacted before transmission. Avoid embedding secrets inside free-form error messages or stack strings, which cannot be field-redacted.

## Diagnose a missing connection

1. Confirm the desktop app is open and listening on `9090`.
2. Confirm the SDK is configured only in a development build.
3. Use the correct simulator host from [Getting started](/getting-started/).
4. Check `client.getStats()` for queueing or dropped events.
5. Remember that physical-device LAN connections are intentionally unavailable.
