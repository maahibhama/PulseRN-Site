import assert from "node:assert/strict";
import test from "node:test";
import {
  assetDefinitions,
  getLatestRelease,
  parseRelease,
} from "../src/lib/releases.mjs";

const completeRelease = {
  tag_name: "v0.2.0",
  name: "PulseRN 0.2.0",
  body: "A useful release.",
  published_at: "2026-07-01T00:00:00Z",
  html_url: "https://github.com/maahibhama/PulseRN/releases/tag/v0.2.0",
  draft: false,
  prerelease: false,
  assets: [
    ["PulseRN-0.2.0-mac-arm64.dmg", 1],
    ["PulseRN-0.2.0-mac-x64.dmg", 2],
    ["PulseRN-0.2.0-windows-x64-setup.exe", 3],
    ["PulseRN-0.2.0-windows-arm64-setup.exe", 4],
    ["PulseRN-0.2.0-linux-x64.AppImage", 5],
    ["PulseRN-0.2.0-linux-x64.deb", 6],
    ["SHA256SUMS.txt", 7],
  ].map(([name, size]) => ({
    name,
    size,
    browser_download_url: `https://example.test/${name}`,
  })),
};

test("parses and labels every required stable artifact", () => {
  const release = parseRelease(completeRelease, { strict: true });
  assert.equal(release.version, "0.2.0");
  assert.equal(release.assets.length, assetDefinitions.length);
  assert.deepEqual(release.missing, []);
});

test("rejects prereleases as latest stable releases", () => {
  assert.throws(
    () => parseRelease({ ...completeRelease, prerelease: true }),
    /not a stable/,
  );
});

test("falls back when only a prerelease is returned", async () => {
  const release = await getLatestRelease({
    fetchImpl: async () => ({
      ok: true,
      status: 200,
      json: async () => ({ ...completeRelease, prerelease: true }),
    }),
    strict: false,
  });
  assert.equal(release.source, "fallback");
});

test("strict validation rejects an incomplete release", () => {
  const incomplete = {
    ...completeRelease,
    assets: completeRelease.assets.slice(0, -1),
  };
  assert.throws(
    () => parseRelease(incomplete, { strict: true }),
    /SHA-256 checksums/,
  );
});

test("non-strict validation exposes missing artifacts", () => {
  const incomplete = {
    ...completeRelease,
    assets: completeRelease.assets.slice(0, -1),
  };
  assert.deepEqual(parseRelease(incomplete).missing, ["SHA-256 checksums"]);
});

test("uses checked-in fallback when the API is unavailable", async () => {
  const release = await getLatestRelease({
    fetchImpl: async () => {
      throw new Error("offline");
    },
    strict: false,
  });
  assert.equal(release.source, "fallback");
  assert.match(release.reason, /unavailable/);
});

test("uses checked-in fallback when no stable release exists", async () => {
  const release = await getLatestRelease({
    fetchImpl: async () => ({ status: 404, ok: false }),
    strict: true,
  });
  assert.equal(release.source, "fallback");
  assert.match(release.reason, /No stable release/);
});
