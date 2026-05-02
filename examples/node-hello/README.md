# Node: hello `BrightsyClient`

1. Copy `.env.example` to `.env` and set `BRIGHTSY_API_KEY`.
2. From the cookbook repo root: `pnpm install` then `pnpm --filter node-hello start`.

Without credentials, the script prints setup hints and exits successfully (useful for CI smoke).

## Code (`index.mjs`)

```javascript
import { BrightsyClient } from '@brightsy/client';

const apiKey = process.env.BRIGHTSY_API_KEY;
if (!apiKey) {
  console.log('Set BRIGHTSY_API_KEY to run a live request (see README).');
  console.log('SDK import OK:', typeof BrightsyClient);
  process.exit(0);
}

const client = new BrightsyClient({ api_key: apiKey });
const agents = await client.agents.list();
console.log('Agents:', agents?.length ?? agents);
```
