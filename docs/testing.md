# Testing

1. Use `agent-browser` for UI flows that need a real browser: smoke checks, bug repros, screenshots, visual diffs, console errors, network inspection, and short end-to-end workflows. Keep unit and integration tests in the project runner; do not replace deterministic tests with browser driving.
2. Follow the loop: `open`, `snapshot -i`, interact by `@eN` ref, wait for the expected change, then snapshot again. Refs are stale after navigation, form submission, modal changes, or SPA re-render.
3. Wait on facts, not time. Prefer `wait --text`, `wait --url`, `wait --load networkidle`, `wait "#selector" --state hidden`, or `wait --fn` over bare sleeps.
4. Capture evidence when a human will review the result. Use `screenshot --annotate` for element maps, `diff screenshot --baseline` for visual regressions, `console` and `errors` for frontend failures, `network requests` for request debugging, and `record start` / `record stop` for interactive repros.
5. For authenticated testing, keep credentials out of commands and docs. Prefer `auth save ... --password-stdin`, `--session-name`, `state save`, or a browser-derived state file. Treat state files as secrets and keep them out of git.
6. For AI-driven runs, turn on guardrails: `--content-boundaries`, `--allowed-domains`, `--max-output`, and an `--action-policy` that blocks destructive actions unless the task explicitly needs them.
7. Use a named session per test or agent: `agent-browser --session smoke open http://localhost:3000`. Close sessions with `agent-browser close` or `agent-browser close --all` so stale daemons do not affect later runs.

## Basic flow

```bash
agent-browser open http://localhost:3000
agent-browser snapshot -i
agent-browser fill @e3 "demo@example.com"
agent-browser click @e5
agent-browser wait --url "**/dashboard"
agent-browser snapshot -i
agent-browser screenshot --annotate ./artifacts/dashboard.png
agent-browser close
```

## Docker and isolation

1. Use Docker for local or CI isolation when the app under test, browser state, and artifacts should be disposable. Build the image with Node, `agent-browser`, and Chrome/Chromium installed; run `agent-browser install --with-deps` during image setup on Linux when the base image does not already include browser dependencies.
2. If the app runs on the host and Agent Browser runs in a container, open the host service through `http://host.docker.internal:<port>` on Docker Desktop. On Linux Docker Engine, add the mapping explicitly with `--add-host=host.docker.internal:host-gateway`.
3. Containerized Chrome often needs launch args when running as root or with small shared memory. Prefer a non-root container user. If that is not practical, pass the minimum flags through `AGENT_BROWSER_ARGS`, commonly `--no-sandbox,--disable-setuid-sandbox,--disable-dev-shm-usage`.
4. Do not treat Docker as a hard security boundary for untrusted code. For untrusted pages, user-submitted code, or public agent workloads, use a microVM-style sandbox such as Vercel Sandbox with Agent Browser installed in the sandbox image or snapshot.
5. Cache the browser environment when startup matters. For hosted sandbox runs, use a snapshot that already contains system dependencies, `agent-browser`, and Chromium; for Docker, publish a small internal image instead of installing Chrome on every test job.

Minimal Docker shape:

```Dockerfile
FROM node:24-bookworm

RUN npm install -g agent-browser \
  && agent-browser install --with-deps

USER node
RUN agent-browser install

WORKDIR /workspace
```

Run against a host dev server:

```bash
docker run --rm \
  --add-host=host.docker.internal:host-gateway \
  -e AGENT_BROWSER_ARGS="--disable-dev-shm-usage" \
  -v "$PWD/artifacts:/workspace/artifacts" \
  agent-browser-tests \
  sh -lc 'agent-browser open http://host.docker.internal:3000 && agent-browser screenshot artifacts/home.png && agent-browser close'
```
