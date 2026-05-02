# Node: hello `BrightsyClient`

1. Copy `.env.example` to `.env` and set `BRIGHTSY_API_KEY`.
2. From the cookbook repo root: `pnpm install` then `pnpm --filter node-hello start`.

Without credentials, the script prints setup hints and exits successfully (useful for CI smoke).
