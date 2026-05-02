# Example: Webhooks

`client.webhooks`: list, get, create, update, delete, and **`test(id)`** to send a **test payload** to the configured endpoint.

## Code snippets

```javascript
import { BrightsyClient } from '@brightsy/client';

const client = new BrightsyClient({
  api_key: process.env.BRIGHTSY_API_KEY,
  account_id: process.env.BRIGHTSY_ACCOUNT_ID,
});

const hooks = await client.webhooks.list();
const webhookId = process.env.BRIGHTSY_WEBHOOK_ID || hooks[0]?.id;

await client.webhooks.get(webhookId);
await client.webhooks.test(webhookId);

// CRUD (see SDK for payload shapes)
await client.webhooks.create({ /* name, url, events, ... */ });
await client.webhooks.update(webhookId, { /* partial */ });
await client.webhooks.delete(webhookId);
```

Full runnable script: [`index.mjs`](index.mjs).

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
