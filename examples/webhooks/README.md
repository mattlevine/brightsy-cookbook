# Example: Webhooks

`client.webhooks`: list, get, create, update, delete, and **`test(id)`** to send a **test payload** to the configured endpoint.

## Env

| Variable | Required | Notes |
| --- | --- | --- |
| `BRIGHTSY_API_KEY` | yes | |
| `BRIGHTSY_ACCOUNT_ID` | yes | |
| `BRIGHTSY_WEBHOOK_ID` | no | Defaults to first webhook from `list()` |
| `BRIGHTSY_RUN_WEBHOOK_TEST` | no | Set `1` to invoke `webhooks.test()` |
| `BRIGHTSY_VERBOSE` | no | `1` = cheatsheet |

```bash
pnpm --filter webhooks start
```
