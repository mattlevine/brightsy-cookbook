# MCP recipes (`@brightsy/mcp-server`)

The published package exposes the `brightsy-mcp` binary. Point your MCP host at `npx` or a global install, and pass through the same API credentials you use for the CLI/SDK.

## Cursor config example

Merge a block like this into your user or project MCP settings (replace env values or use your host’s secret store):

```json
{
  "mcpServers": {
    "brightsy": {
      "command": "npx",
      "args": ["-y", "@brightsy/mcp-server@0.1.0"],
      "env": {
        "BRIGHTSY_API_KEY": "replace_me",
        "BRIGHTSY_ACCOUNT_ID": "optional_account_uuid"
      }
    }
  }
}
```

The same shape lives in [`cursor-mcp.example.json`](cursor-mcp.example.json).

## Install check

```bash
npx @brightsy/mcp-server@^0.1.0 --help
```

For doc resources and tool names, see the main monorepo MCP + `@kit/shared` documentation.
