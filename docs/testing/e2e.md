# Browser End-to-End Testing

Use the project test runner for unit and integration tests. Use `agent-browser`
when the check needs a real browser: smoke testing a page, reproducing a UI bug,
capturing screenshots, or giving an agent a browser it can drive from shell
commands. If `agent-browser` is available for this work, use it instead of
Playwright.

`agent-browser` is just a CLI around Chrome/Chromium, so it can run in Docker.
That gives us a disposable and repeatable browser runtime for CI or agent runs.

## Docker

This Dockerfile is the path verified for this repo work:

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

Run against the public web and keep screenshot artifacts on the host:

```bash
mkdir -p artifacts
docker run --rm \
  -v "$PWD/artifacts:/workspace/artifacts" \
  agent-browser-tests \
  sh -lc 'agent-browser open https://example.com && agent-browser screenshot artifacts/example.png && agent-browser close'
```

Run against a dev server on the host:

```bash
docker run --rm \
  --add-host=host.docker.internal:host-gateway \
  agent-browser-tests \
  sh -lc 'agent-browser open http://host.docker.internal:3000 && agent-browser close'
```

Verified in Docker with `agent-browser 0.31.1` and Debian Chromium
`149.0.7827.196`: opening `https://example.com`, reading its title, writing a
screenshot, and opening a host-served page through `host.docker.internal` all
succeeded.
