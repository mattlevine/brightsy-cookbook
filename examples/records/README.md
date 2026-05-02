# Example: Record types & records

`BrightsyClient` **CMA** / **CDA** / **CPA**: record types, **multi-condition filters** (`where`, `and`, `or`), **tags**, **field selection** (`select` / `groupBy`), **aggregates** (`count`, `sum`, `avg`, `min`, `max`), **natural-language search** (`nlSearch` / `naturalLanguage`, `withFreshness`), and **`getByIds`**.

Where **operators** (see SDK `WhereFilter`): `eq`, `neq`, `gt`, `gte`, `lt`, `lte`, `like`, `ilike`, `in`, `notIn`, `begins`, `ends`.

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
