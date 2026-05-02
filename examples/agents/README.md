# Example: Agents

`client.agents.list` / `get`, and **`client.agent(id).complete()`** for a stateless chat turn. For workspace chats, use `AgentRequest` methods like `listChats()`, `chat(id).send()`, etc. (see SDK).

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
