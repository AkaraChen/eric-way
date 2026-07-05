---
name: eric-e2e-testing
description: Apply Eric's browser end-to-end testing standards. Use when a task needs a real browser, UI smoke test, screenshot capture, browser bug reproduction, Dockerized browser test run, or agent-browser based verification.
---

# Eric E2E Testing

Use this skill when the check needs a real browser: smoke testing a page, reproducing a UI bug, capturing screenshots, verifying critical flows, or giving an agent a browser it can drive from shell commands. If `agent-browser` is available, use it instead of Playwright.

Related: use `$eric-writing-tests` for unit and integration tests.

## Workflow

1. Confirm the risk needs browser behavior. If a narrower check already proves it, do not add E2E.
2. Prefer `agent-browser` for browser smoke checks, screenshots, and agent-driven UI reproduction.
3. Keep E2E coverage narrow: critical flows, real browser rendering, navigation, authentication handoffs, screenshots, or bugs that only reproduce in Chrome/Chromium.
4. Save useful artifacts, especially screenshots, under an artifacts directory that CI or the agent can collect.
5. Close browser sessions after the check.

## Docker Baseline

Use this verified shape for disposable browser runs:

```Dockerfile
FROM node:24-bookworm

RUN apt-get update \
  && apt-get install -y --no-install-recommends chromium ca-certificates \
  && rm -rf /var/lib/apt/lists/*

RUN npm install -g agent-browser

ENV AGENT_BROWSER_EXECUTABLE_PATH=/usr/bin/chromium
ENV AGENT_BROWSER_ARGS=--no-sandbox,--disable-setuid-sandbox,--disable-dev-shm-usage

WORKDIR /workspace
```

Build it:

```bash
docker build -t agent-browser-tests .
```

Run against the public web and keep screenshots on the host:

```bash
mkdir -p artifacts
docker run --rm \
  -v "$PWD/artifacts:/workspace/artifacts" \
  agent-browser-tests \
  sh -lc 'agent-browser open https://example.com && agent-browser screenshot artifacts/example.png && agent-browser close'
```

Run against a host dev server:

```bash
docker run --rm \
  --add-host=host.docker.internal:host-gateway \
  agent-browser-tests \
  sh -lc 'agent-browser open http://host.docker.internal:3000 && agent-browser close'
```

## Standards

- Prefer the smallest browser check that proves the risk.
- Keep deterministic smoke checks over broad brittle click tours.
- Verify screenshots exist when screenshot capture is the proof.
- Document browser and `agent-browser` versions when the result depends on the runtime.
- Do not use Playwright by default when `agent-browser` is available for this work.

## Boundaries

- Do not use E2E for risks a narrower check can prove.
- Do not add hosted browser provider assumptions unless the task explicitly needs that provider.
- Do not leave browser processes running after the check.
