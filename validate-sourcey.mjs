import fs from "node:fs";
import crypto from "node:crypto";

const required = [
  "site/index.html",
  "site/api.html",
  "site/search-index.json",
  "site/sitemap.xml",
  "site/llms.txt",
  "site/llms-full.txt",
  "site/sourcey.css",
  "site/sourcey.js",
  "upstream/openapi.json",
  "evidence.json",
  "report.md",
];

const missing = required.filter((p) => !fs.existsSync(p));
if (missing.length) {
  console.error(JSON.stringify({ ok: false, reason: "missing_files", missing }));
  process.exit(2);
}

const apiRaw = fs.readFileSync("upstream/openapi.json", "utf8");
const api = JSON.parse(apiRaw);
const verbs = new Set(["get", "post", "put", "patch", "delete", "head", "options", "trace"]);
let operations = 0;
for (const value of Object.values(api.paths ?? {})) {
  for (const method of Object.keys(value ?? {})) {
    if (verbs.has(method.toLowerCase())) operations += 1;
  }
}

const paths = Object.keys(api.paths ?? {}).length;
const schemas = Object.keys(api.components?.schemas ?? {}).length;
if (paths !== 21 || operations !== 27 || schemas !== 33) {
  console.error(JSON.stringify({ ok: false, reason: "surface_mismatch", paths, operations, schemas }));
  process.exit(3);
}

const indexRaw = fs.readFileSync("site/index.html", "utf8");
if (!indexRaw.includes("Agent Protocol")) {
  console.error(JSON.stringify({ ok: false, reason: "index_missing_project_name" }));
  process.exit(4);
}

const publicUrl = "https://sgagestudio.github.io/agent-protocol-sourcey-docs/";
const llmsUrl = publicUrl + "llms.txt";
const [home, llms] = await Promise.all([
  fetch(publicUrl, { redirect: "follow" }),
  fetch(llmsUrl, { redirect: "follow" }),
]);
const homeText = await home.text();
const llmsText = await llms.text();

if (!home.ok || !homeText.includes("Agent Protocol")) {
  console.error(JSON.stringify({ ok: false, reason: "public_home_failed", status: home.status }));
  process.exit(5);
}
if (!llms.ok || !llmsText.includes("Agent Protocol")) {
  console.error(JSON.stringify({ ok: false, reason: "public_llms_failed", status: llms.status }));
  process.exit(6);
}

const sha256 = (v) => crypto.createHash("sha256").update(v).digest("hex");
const result = {
  ok: true,
  public_url: publicUrl,
  upstream_repo: "https://github.com/langchain-ai/agent-protocol",
  sourcey_version: "3.6.12",
  paths,
  operations,
  schemas,
  required_files: required.length,
  openapi_sha256: sha256(apiRaw),
  index_sha256: sha256(indexRaw),
  public_home_status: home.status,
  public_llms_status: llms.status,
};
console.log(JSON.stringify(result));
