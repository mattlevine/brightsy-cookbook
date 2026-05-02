# Brightsy cookbook

Recipes and small examples for **[`@brightsy/client`](https://www.npmjs.com/package/@brightsy/client)**, the **[`brightsy` CLI](https://www.npmjs.com/package/@brightsy/cli)**, and the **[`@brightsy/mcp-server`](https://www.npmjs.com/package/@brightsy/mcp-server)** MCP host.

**Source of truth** for the SDK, CLI, and MCP implementation is the [`brightsy-ai`](https://github.com/mattlevine/brightsy-ai) monorepo (`packages/brightsy-types`, `packages/brightsy-schema-builder`, `packages/brightsy-client`, `packages/brightsy-cli`, `packages/brightsy-mcp-server`). This repository stays small: install published packages from npm and follow the guides below.

## Layout

| Path | What |
| --- | --- |
| [`examples/node-hello`](examples/node-hello) | Minimal ESM script using `BrightsyClient` |
| [`examples/records`](examples/records) | Record types & record querying (CMA / CDA) |
| [`examples/files`](examples/files) | Account file storage (`client.files`) |
| [`examples/webhooks`](examples/webhooks) | Webhooks list + optional `test()` |
| [`examples/agents`](examples/agents) | Agents list / get / `complete()` |
| [`examples/scenarios`](examples/scenarios) | Scenarios list / get / `trigger` |
| [`recipes/cli`](recipes/cli) | Copy-paste CLI command patterns |
| [`recipes/mcp`](recipes/mcp) | MCP host config snippets (Cursor, etc.) |

## Quick start (Node)

```bash
pnpm install
pnpm run examples:smoke
# or individually: pnpm --filter records start
```

Set `BRIGHTSY_API_KEY` (and any other vars your recipe needs) in the environment or a local `.env` (not committed).

## Updating dependency pins

Bump `@brightsy/*` in each [`examples/*/package.json`](examples/) when you publish new releases from the monorepo, or use Renovate.

The root [`package.json`](package.json) includes a **`pnpm.overrides`** entry for `@brightsy/types` so installs work even if a published `@brightsy/client` tarball still lists `workspace:*` for types (pnpm cannot resolve that outside a monorepo). Remove that override once the client package on npm declares a normal semver dependency on `@brightsy/types`.
