# Example: Record types & records

`BrightsyClient` **CMA** / **CDA** / **CPA**: record types, **multi-condition filters** (`where`, `and`, `or`), **tags**, **field selection** (`select` / `groupBy`), **aggregates** (`count`, `sum`, `avg`, `min`, `max`), **natural-language search** (`nlSearch` / `naturalLanguage`, `withFreshness`), and **`getByIds`**.

Where **operators** (see SDK `WhereFilter`): `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `in`, `notIn`, `begins`, `ends`.

## Code snippets

**Client and record types**

```javascript
import { BrightsyClient } from '@brightsy/client';

const client = new BrightsyClient({
  api_key: process.env.BRIGHTSY_API_KEY,
  account_id: process.env.BRIGHTSY_ACCOUNT_ID,
});

const types = await client.cma.listRecordTypes();
const slug = process.env.BRIGHTSY_RECORD_TYPE_SLUG || types[0]?.slug;
const detail = await client.recordTypes.get(slug);
```

**List + debug URL (CMA)**

```javascript
const listed = await client.cma
  .recordType(slug)
  .orderBy('updated_at', 'desc')
  .page(1)
  .limit(5)
  .get();

const url = client.cma
  .recordType(slug)
  .where('updated_at', 'gte', '1970-01-01')
  .orderBy('updated_at', 'desc')
  .page(1)
  .limit(5)
  .getUrl();
```

**Advanced filters, tags, projection**

```javascript
const chain = client.cma
  .recordType(slug)
  .where('updated_at', 'gte', '2020-01-01T00:00:00.000Z')
  .and('updated_at', 'lte', new Date().toISOString())
  .where('status', 'eq', 'published') // optional extra predicate
  .tags('featured')
  .select('id', 'title', 'updated_at')
  .orderBy('updated_at', 'desc')
  .page(1)
  .limit(10);

const res = await chain.get();
```

**Aggregates**

```javascript
await client.cma.recordType(slug).where('updated_at', 'gte', '1970-01-01').count().page(1).limit(5).get();

await client.cma.recordType(slug).sum('amount').count().page(1).limit(5).get();

await client.cma.recordType(slug).groupBy('category_id').count().page(1).limit(20).get();
```

**CDA natural language + recency**

```javascript
await client.cda
  .recordType(slug)
  .nlSearch('recent updates', 0.65)
  .withFreshness(14)
  .limit(5)
  .get();
```

**Batch by IDs**

```javascript
await client.cma.recordType(slug).getByIds(['uuid-a', 'uuid-b']);
```

Full runnable script: [`index.mjs`](index.mjs). Set `BRIGHTSY_VERBOSE=1` for CRUD and query cheatsheets printed to the console.

## Env

| Variable | Required | Notes |
| --- | --- | --- |
| `BRIGHTSY_API_KEY` | yes | |
| `BRIGHTSY_ACCOUNT_ID` | yes | |
| `BRIGHTSY_RECORD_TYPE_SLUG` | no | Defaults to first type from `listRecordTypes()` |
| `BRIGHTSY_RECORD_ID` | no | Single-record `.id().get()` |
| `BRIGHTSY_RECORD_IDS` | no | Comma-separated UUIDs for `getByIds()` |
| `BRIGHTSY_FILTER_FIELD` | no | Extra `where` (use with OP + VALUE) |
| `BRIGHTSY_FILTER_OP` | no | e.g. `eq`, `ilike`, `in` |
| `BRIGHTSY_FILTER_VALUE` | no | String or value for filter |
| `BRIGHTSY_RECORD_TAG` | no | One tag for `.tags()` |
| `BRIGHTSY_SELECT_FIELDS` | no | Comma-separated fields for `.select()` |
| `BRIGHTSY_AGG_SUM_FIELD` | no | Numeric field for `.sum()` demo |
| `BRIGHTSY_AGG_AVG_FIELD` | no | Numeric field for `.avg()` demo |
| `BRIGHTSY_AGG_GROUP_BY` | no | Field for `.groupBy().count()` |
| `BRIGHTSY_TRY_NL` | no | `1` = CDA `nlSearch` + `withFreshness` |
| `BRIGHTSY_NL_QUERY` | no | NL text (default `recent updates`) |
| `BRIGHTSY_NL_THRESHOLD` | no | Match threshold (default `0.65`) |
| `BRIGHTSY_NL_TIME_DECAY_DAYS` | no | For `withFreshness()` (default `14`) |
| `BRIGHTSY_NL_LIMIT` | no | Row cap (default `5`) |
| `BRIGHTSY_VERBOSE` | no | `1` = print CRUD + filter/aggregate cheatsheets |

## Run

```bash
pnpm --filter records start
```
