# CLI recipes (`brightsy`)

Install globally or use `npx`:

```bash
npx @brightsy/cli@^0.1.0 --help
```

## Auth

```bash
brightsy login
brightsy whoami
```

## Example commands

Record types and records:

```bash
brightsy record-types list
brightsy record-types get <slug>
brightsy records list <record-type>
brightsy records get <record-type> <id>
brightsy records create <record-type>
brightsy records update <record-type> <id>
brightsy records delete <record-type> <id>
```

Agents, scenarios, webhooks, files:

```bash
brightsy agents list
brightsy agents create <project-name>

brightsy scenarios list
brightsy scenarios get <scenario-id>
brightsy scenarios trigger <scenario-id>

brightsy webhooks list
brightsy webhooks create <name> <url>

brightsy files list
brightsy files upload <filename>
brightsy files delete <path>
```

Chat (when configured):

```bash
brightsy chat "Hello"
```

Use `brightsy --help` and `brightsy <command> --help` for the full surface; align with SDK entry points in the monorepo `packages/brightsy-client/src/Client.ts`.

Record-style operations typically mirror `cma` / `cda` / `cpa` patterns (see product docs and `@kit/shared` MCP docs in the main repo).
