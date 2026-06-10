const path = require("node:path");

const { ARTIFACT_INDEX_URL } = require("./config");

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&#47;", "/")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'");
}

function toAbsoluteArtifactUrl(href) {
  return new URL(href.replace(/^["']|["']$/g, ""), ARTIFACT_INDEX_URL).toString();
}

function parseArtifactIndex(html) {
  const artifacts = [];
  const linkPattern = /<a\b[^>]*href\s*=\s*["']?([^"'\s>]+)["']?[^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = linkPattern.exec(html))) {
    const href = decodeHtml(match[1]);
    if (!href.endsWith("/server.7z")) {
      continue;
    }

    const url = toAbsoluteArtifactUrl(href);
    const folder = path.basename(path.dirname(new URL(url).pathname));
    const build = Number.parseInt(folder.split("-")[0], 10);
    const text = decodeHtml(match[2].replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
    const recommended = /LATEST RECOMMENDED/i.test(text);
    const optional = /LATEST OPTIONAL/i.test(text);

    artifacts.push({
      build,
      folder,
      url,
      label: recommended
        ? `Latest recommended (${build})`
        : optional
          ? `Latest optional (${build})`
          : `Build ${build}`,
      channel: recommended ? "recommended" : optional ? "optional" : "archive"
    });
  }

  const unique = new Map();
  for (const artifact of artifacts) {
    if (!unique.has(artifact.url)) {
      unique.set(artifact.url, artifact);
    }
  }

  return [...unique.values()].sort((a, b) => {
    if (a.channel === "recommended") return -1;
    if (b.channel === "recommended") return 1;
    if (a.channel === "optional") return -1;
    if (b.channel === "optional") return 1;
    return b.build - a.build;
  });
}

async function fetchArtifacts() {
  const response = await fetch(ARTIFACT_INDEX_URL);
  if (!response.ok) {
    throw new Error(`Artifact index failed: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  return parseArtifactIndex(html).slice(0, 40);
}

module.exports = {
  fetchArtifacts,
  parseArtifactIndex
};
