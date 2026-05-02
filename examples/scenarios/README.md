# Example: Scenarios

`client.scenarios`: `list`, `get`, `getExecutions`, **`trigger`**, plus `create` / `update` / `delete` for definitions (see SDK). Legacy one-off: `client.scenario(id).trigger(data)`.

## Code snippets

```javascript
import { BrightsyClient } from '@brightsy/client';

const client = new BrightsyClient({
  api_key: process.env.BRIGHTSY_API_KEY,
  account_id: process.env.BRIGHTSY_ACCOUNT_ID,
});

const all = await client.scenarios.list();
const scenarioId = process.env.BRIGHTSY_SCENARIO_ID || all[0]?.id;

await client.scenarios.get(scenarioId);
await client.scenarios.getExecutions(scenarioId, { page: 1, limit: 3 });

const input = process.env.BRIGHTSY_SCENARIO_INPUT
  ? JSON.parse(process.env.BRIGHTSY_SCENARIO_INPUT)
  : {};

const run = await client.scenarios.trigger(scenarioId, { input });
```

Full runnable script: [`index.mjs`](index.mjs).

## Env

| Variable | Required | Notes |
| --- | --- | --- |
| `BRIGHTSY_API_KEY` | yes | |
| `BRIGHTSY_ACCOUNT_ID` | yes | |
| `BRIGHTSY_SCENARIO_ID` | no | Defaults to first from `list()` |
| `BRIGHTSY_SCENARIO_INPUT` | no | JSON string passed as `input` to `trigger` |
| `BRIGHTSY_SKIP_TRIGGER` | no | `1` = list/get/executions only |

```bash
pnpm --filter scenarios start
```
