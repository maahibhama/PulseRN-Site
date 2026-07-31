import fallback from "../data/release-fallback.json" with { type: "json" };

export const assetDefinitions = [
  {
    key: "macArm64",
    label: "macOS · Apple silicon",
    pattern: /^PulseRN-.+-mac-arm64\.dmg$/,
  },
  {
    key: "macX64",
    label: "macOS · Intel",
    pattern: /^PulseRN-.+-mac-x64\.dmg$/,
  },
  {
    key: "windowsX64",
    label: "Windows · x64",
    pattern: /^PulseRN-.+-windows-x64-setup\.exe$/,
  },
  {
    key: "windowsArm64",
    label: "Windows · ARM64",
    pattern: /^PulseRN-.+-windows-arm64-setup\.exe$/,
  },
  {
    key: "linuxAppImage",
    label: "Linux · AppImage",
    pattern: /^PulseRN-.+-linux-x64\.AppImage$/,
  },
  {
    key: "linuxDeb",
    label: "Linux · Debian",
    pattern: /^PulseRN-.+-linux-x64\.deb$/,
  },
  {
    key: "checksums",
    label: "SHA-256 checksums",
    pattern: /^SHA256SUMS\.txt$/,
  },
];

export function parseRelease(payload, { strict = false } = {}) {
  if (!payload || payload.draft || payload.prerelease || !payload.tag_name) {
    throw new Error("The GitHub response is not a stable PulseRN release.");
  }

  const assets = Array.isArray(payload.assets) ? payload.assets : [];
  const matched = assetDefinitions
    .map((definition) => {
      const asset = assets.find((candidate) =>
        definition.pattern.test(candidate.name),
      );
      return (
        asset && {
          key: definition.key,
          label: definition.label,
          name: asset.name,
          url: asset.browser_download_url,
          size: asset.size ?? 0,
        }
      );
    })
    .filter(Boolean);

  const missing = assetDefinitions
    .filter(
      (definition) => !matched.some((asset) => asset.key === definition.key),
    )
    .map((definition) => definition.label);

  if (strict && missing.length) {
    throw new Error(
      `Release ${payload.tag_name} is incomplete: missing ${missing.join(", ")}`,
    );
  }

  return {
    source: "github",
    version: payload.tag_name.replace(/^v/, ""),
    name: payload.name || `PulseRN ${payload.tag_name}`,
    publishedAt: payload.published_at,
    url: payload.html_url,
    notes: payload.body || "See GitHub for the complete release notes.",
    assets: matched,
    missing,
  };
}

export async function getLatestRelease(options = {}) {
  const {
    fetchImpl = globalThis.fetch,
    strict = process.env.CI === "true",
    token = process.env.GITHUB_TOKEN,
  } = options;

  try {
    const headers = {
      Accept: "application/vnd.github+json",
      "User-Agent": "PulseRN-docs-build",
      "X-GitHub-Api-Version": "2022-11-28",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const response = await fetchImpl(
      "https://api.github.com/repos/maahibhama/PulseRN/releases/latest",
      { headers, signal: AbortSignal.timeout(5000) },
    );
    if (response.status === 404)
      return { ...fallback, reason: "No stable release is published yet." };
    if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
    return parseRelease(await response.json(), { strict });
  } catch (error) {
    if (strict && /incomplete/.test(String(error))) throw error;
    return {
      ...fallback,
      reason: "Live release data was unavailable during this build.",
    };
  }
}

export function formatBytes(bytes) {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  return `${(bytes / 1024 ** exponent).toFixed(exponent ? 1 : 0)} ${units[exponent]}`;
}
