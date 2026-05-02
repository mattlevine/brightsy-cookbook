# Example: Scenarios

`client.scenarios`: `list`, `get`, `getExecutions`, **`trigger`**, plus `create` / `update` / `delete` for definitions (see SDK). Legacy one-off: `client.scenario(id).trigger(data)`.

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
