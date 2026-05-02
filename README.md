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

### Minimal client usage

```javascript
import { BrightsyClient } from '@brightsy/client';

const client = new BrightsyClient({
  api_key: process.env.BRIGHTSY_API_KEY,
  account_id: process.env.BRIGHTSY_ACCOUNT_ID, // required for most account APIs
});

const types = await client.cma.listRecordTypes();
const slug = types[0]?.slug;
if (slug) {
  const res = await client.cma.recordType(slug).orderBy('updated_at', 'desc').page(1).limit(5).get();
  console.log(res.data?.length, 'rows');
}
```

See [`examples/node-hello`](examples/node-hello) for the smallest runnable script and the other `examples/*` folders for full flows.

### Query records (advanced filters, CMA)

Structured filters stack with `where` / `and` / `or` (operators include `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `in`, `notIn`, `begins`, `ends`). Optional `tags`, `select` / `groupBy`, sorting, and pagination chain before `.get()`.

```javascript
const slug = 'posts'; // or from client.cma.listRecordTypes()

const filtered = await client.cma
  .recordType(slug)
  .where('updated_at', 'gte', '2024-01-01T00:00:00.000Z')
  .and('updated_at', 'lte', new Date().toISOString())
  .where('status', 'eq', 'published')
  .tags('featured')
  .select('id', 'title', 'updated_at')
  .orderBy('updated_at', 'desc')
  .page(1)
  .limit(20)
  .get();

// Inspect the exact query URL (useful while integrating)
const debugUrl = client.cma
  .recordType(slug)
  .where('title', 'ilike', '%report%')
  .page(1)
  .limit(10)
  .getUrl();
```

### Natural-language search (CDA)

Semantic search over **published** content uses **`cda`** (not `cma`). `nlSearch(query, matchThreshold)` pairs with `withFreshness(timeDecayDays)` when you want recency blended into ranking.

```javascript
const slug = 'posts';

const nl = await client.cda
  .recordType(slug)
  .nlSearch('Q4 goals and revenue summary', 0.72)
  .withFreshness(14)
  .limit(10)
  .get();

console.log(nl.data?.length, 'matches');
```

### Call an agent (stateless completion)

List agents, pick one by id, then run a single chat turn with **`client.agent(agentId).complete()`** (messages follow a familiar `{ role, content }` shape). For multi-turn workspace chats, thread management, and tools, use **`AgentRequest`** on the SDK (`listChats()`, `chat(id).send()`, …).

```javascript
const { data, total } = await client.agents.list({ include_models: false });
const agentId = data[0]?.id; // or a known UUID

const agent = await client.agents.get(agentId);

const completion = await client.agent(agentId).complete({
  messages: [{ role: 'user', content: 'Summarize what you can do in one sentence.' }],
  max_tokens: 120,
});

const text =
  typeof completion?.message === 'string'
    ? completion.message
    : completion?.choices?.[0]?.message?.content ?? JSON.stringify(completion);

console.log(text);
```

Runnable script: [`examples/agents`](examples/agents) (`pnpm --filter agents start`; set `BRIGHTSY_SKIP_COMPLETE=1` to skip the LLM call).

For aggregates (`count`, `sum`, `avg`, …), `getByIds`, env-driven demos, and CRUD cheatsheets, run [`examples/records`](examples/records) (`pnpm --filter records start`, optional `BRIGHTSY_VERBOSE=1`).

## Updating dependency pins

Bump `@brightsy/*` in each [`examples/*/package.json`](examples/) when you publish new releases from the monorepo, or use Renovate.

The root [`package.json`](package.json) includes a **`pnpm.overrides`** entry for `@brightsy/types` so installs work even if a published `@brightsy/client` tarball still lists `workspace:*` for types (pnpm cannot resolve that outside a monorepo). Remove that override once the client package on npm declares a normal semver dependency on `@brightsy/types`.
