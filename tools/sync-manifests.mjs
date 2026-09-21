#!/usr/bin/env node
// Generates every plugin and marketplace manifest from plugins.json.
//
//   node tools/sync-manifests.mjs           # write the generated files
//   node tools/sync-manifests.mjs --check   # fail if anything is out of date
//
// Never hand-edit the generated files. Edit plugins.json instead.
// Generated: plugins/<name>/plugin.json
//            plugins/<name>/.claude-plugin/plugin.json
//            plugins/<name>/.codex-plugin/plugin.json
//            plugins/<name>/agents/openai.yaml
//            .claude-plugin/marketplace.json
//            .agents/plugins/marketplace.json

import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const check = process.argv.includes("--check");

const spec = JSON.parse(readFileSync(join(root, "plugins.json"), "utf8"));
const mp = spec.marketplace;
const plugins = spec.plugins ?? [];
const scenarios = spec.scenarios ?? {};

const problems = [];
const fail = (msg) => problems.push(msg);

const AUTHOR = { name: mp.owner.name, url: mp.owner.url };

// ---------------------------------------------------------------- validation

const seen = new Set();
for (const p of plugins) {
  if (seen.has(p.name)) fail(`plugins.json: duplicate plugin name "${p.name}"`);
  seen.add(p.name);

  const declared = p.skills ?? [];
  if (declared.length === 0) fail(`${p.name}: declares no skills`);

  const skillsDir = join(root, "plugins", p.name, "skills");
  if (!existsSync(skillsDir)) {
    fail(`${p.name}: missing plugins/${p.name}/skills/`);
    continue;
  }

  const onDisk = readdirSync(skillsDir, { withFileTypes: true })
    .filter((e) => e.isDirectory() || e.isSymbolicLink())
    .map((e) => e.name)
    .sort();

  for (const s of declared) {
    if (!onDisk.includes(s)) {
      // A skill declared here but on disk elsewhere means it belongs to another plugin.
      const owner = plugins.find((o) => o !== p && (o.skills ?? []).includes(s));
      fail(
        owner
          ? `${p.name}: declares skill "${s}" which lives in plugin "${owner.name}"`
          : `${p.name}: declares skill "${s}" but plugins/${p.name}/skills/${s}/ does not exist`,
      );
      continue;
    }
    const skillMd = join(skillsDir, s, "SKILL.md");
    if (!existsSync(skillMd)) {
      fail(`${p.name}/${s}: missing SKILL.md (a symlinked skill must resolve)`);
      continue;
    }
    const front = readFileSync(skillMd, "utf8").split("\n");
    if (front[0].trim() !== "---") {
      fail(`${p.name}/${s}: SKILL.md has no YAML frontmatter`);
      continue;
    }
    const nameLine = front.slice(1).find((l) => l.startsWith("name:"));
    const declaredName = nameLine?.slice("name:".length).trim();
    if (declaredName !== s) {
      fail(`${p.name}/${s}: SKILL.md frontmatter name is "${declaredName}", expected "${s}"`);
    }
  }

  const extra = onDisk.filter((s) => !declared.includes(s));
  if (extra.length) fail(`${p.name}: skills on disk but not declared in plugins.json: ${extra.join(", ")}`);
}

for (const [name, sc] of Object.entries(scenarios)) {
  for (const p of sc.plugins ?? []) {
    if (!seen.has(p)) fail(`scenario "${name}" references unknown plugin "${p}"`);
  }
  if (!(sc.plugins ?? []).includes("project")) {
    fail(`scenario "${name}" does not include the "project" plugin`);
  }
}

// -------------------------------------------------------------- generation

const files = new Map();
const put = (rel, contents) => files.set(rel, contents.endsWith("\n") ? contents : contents + "\n");
const json = (obj) => JSON.stringify(obj, null, 2);
const yamlStr = (s) => `"${String(s).replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;

for (const p of plugins) {
  const common = {
    name: p.name,
    version: p.version,
    description: p.description,
    author: AUTHOR,
    homepage: mp.homepage,
    repository: mp.repository,
    keywords: p.keywords ?? [],
  };

  put(
    `plugins/${p.name}/plugin.json`,
    json({
      $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
      ...common,
      extensions: {
        "com.openai": {
          interface: {
            displayName: p.displayName,
            shortDescription: p.shortDescription,
            longDescription: p.longDescription,
            developerName: AUTHOR.name,
            category: p.category,
            capabilities: ["Read", "Write"],
            websiteURL: mp.homepage,
            defaultPrompt: p.defaultPrompt ?? [],
          },
        },
      },
    }),
  );

  put(
    `plugins/${p.name}/.claude-plugin/plugin.json`,
    json({ ...common, displayName: p.displayName }),
  );

  put(
    `plugins/${p.name}/.codex-plugin/plugin.json`,
    json({
      ...common,
      skills: "./skills/",
      interface: {
        displayName: p.displayName,
        shortDescription: p.shortDescription,
        longDescription: p.longDescription,
        developerName: AUTHOR.name,
        category: p.category,
        capabilities: ["Read", "Write"],
        websiteURL: mp.homepage,
        defaultPrompt: p.defaultPrompt ?? [],
      },
    }),
  );

  put(
    `plugins/${p.name}/agents/openai.yaml`,
    [
      "interface:",
      `  display_name: ${yamlStr(p.displayName)}`,
      `  short_description: ${yamlStr(p.shortDescription)}`,
      `  default_prompt: ${yamlStr((p.defaultPrompt ?? [])[0] ?? "")}`,
      "",
    ].join("\n"),
  );
}

put(
  ".claude-plugin/marketplace.json",
  json({
    $schema: "https://anthropic.com/claude-code/marketplace.schema.json",
    name: mp.name,
    owner: { name: AUTHOR.name },
    metadata: { description: mp.description, version: mp.version },
    plugins: plugins.map((p) => ({
      name: p.name,
      source: `./plugins/${p.name}`,
      description: p.description,
      version: p.version,
      author: AUTHOR,
      homepage: mp.homepage,
      repository: mp.repository,
      category: p.category,
      keywords: p.keywords ?? [],
    })),
  }),
);

put(
  ".agents/plugins/marketplace.json",
  json({
    name: mp.name,
    interface: { displayName: mp.displayName },
    plugins: plugins.map((p) => ({
      name: p.name,
      source: { source: "local", path: `./plugins/${p.name}` },
      policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
      category: p.category,
    })),
  }),
);

// ------------------------------------------------------------------ write

let written = 0;
let stale = [];

for (const [rel, contents] of files) {
  const abs = join(root, rel);
  const current = existsSync(abs) ? readFileSync(abs, "utf8") : null;
  if (current === contents) continue;
  if (check) {
    stale.push(rel);
    continue;
  }
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, contents);
  written++;
  console.log(`${current === null ? "created" : "updated"} ${rel}`);
}

for (const p of problems) console.error(`error: ${p}`);
for (const rel of stale) console.error(`stale: ${rel}`);

if (problems.length) {
  console.error(`\n${problems.length} problem(s) in plugins.json. Nothing written.`);
  process.exit(1);
}

if (check) {
  if (stale.length) {
    console.error(`\n${stale.length} manifest(s) out of date. Run: node tools/sync-manifests.mjs`);
    process.exit(1);
  }
  console.log(`ok: ${files.size} manifests match plugins.json (${plugins.length} plugins, ${Object.keys(scenarios).length} scenarios)`);
  process.exit(0);
}

console.log(`ok: ${written} file(s) written, ${files.size} manifests in sync`);
