# Example: Agents

`client.agents.list` / `get`, and **`client.agent(id).complete()`** for a stateless chat turn. For workspace chats, use `AgentRequest` methods like `listChats()`, `chat(id).send()`, etc. (see SDK).

## Code snippets

```javascript
import { BrightsyClient } from '@brightsy/client';

const client = new BrightsyClient({
  api_key: process.env.BRIGHTSY_API_KEY,
  account_id: process.env.BRIGHTSY_ACCOUNT_ID,
});

const { data, total } = await client.agents.list({ include_models: false });
const agentId = process.env.BRIGHTSY_AGENT_ID || data[0]?.id;

const agent = await client.agents.get(agentId);

const completion = await client.agent(agentId).complete({
  messages: [{ role: 'user', content: 'Reply with one short sentence.' }],
  max_tokens: 80,
});
```

Full runnable script: [`index.mjs`](index.mjs).

## Env

| Variable | Required | Notes |
| --- | --- | --- |
| `BRIGHTSY_API_KEY` | yes | |
| `BRIGHTSY_ACCOUNT_ID` | yes | |
| `BRIGHTSY_AGENT_ID` | no | Defaults to first agent from `list()` |
| `BRIGHTSY_SKIP_COMPLETE` | no | Set `1` to list/get only (no LLM call) |

```bash
pnpm --filter agents start
```
