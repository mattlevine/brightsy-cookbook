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

## Common flows

Use `brightsy --help` and `brightsy <command> --help` for the full surface; align with SDK getters in the monorepo `packages/brightsy-client/src/Client.ts`.

Record-style operations typically mirror `cma` / `cda` / `cpa` patterns (see product docs and `@kit/shared` MCP docs in the main repo).
