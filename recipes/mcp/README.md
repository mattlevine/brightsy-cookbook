# MCP recipes (`@brightsy/mcp-server`)

The published package exposes the `brightsy-mcp` binary. Point your MCP host at `npx` or a global install, and pass through the same API credentials you use for the CLI/SDK.

## Cursor

See [`cursor-mcp.example.json`](cursor-mcp.example.json) for a shape you can merge into your user or project MCP config. Replace placeholder env values with your own (or use your host’s secret store).

## Install check

```bash
npx @brightsy/mcp-server@^0.1.0 --help
```

For doc resources and tool names, see the main monorepo MCP + `@kit/shared` documentation.
