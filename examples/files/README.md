# Example: Files (account storage)

`client.files`: list objects, optional **signed read URL**, **uploadTemp** probe. See SDK `Client.ts` for `upload`, `uploadUrl`, `move`, `delete`, `createFolder`.

**Image AI** is separate: `client.images` (`analyze`, `suggestEdits`, `generate`).

## Env

| Variable | Required | Notes |
| --- | --- | --- |
| `BRIGHTSY_API_KEY` | yes | |
| `BRIGHTSY_ACCOUNT_ID` | yes | |
| `BRIGHTSY_FILES_PATH` | no | Prefix for `files.list` |
| `BRIGHTSY_FILES_SEARCH` | no | Substring search |
| `BRIGHTSY_FILES_SIGNED_PATH` | no | Existing object path for `signedUrl()` |
| `BRIGHTSY_FILES_SIGNED_TTL` | no | Seconds (default 300) |
| `BRIGHTSY_RUN_FILE_UPLOAD` | no | `1` = tiny `uploadTemp()` |
| `BRIGHTSY_VERBOSE` | no | `1` = print API cheatsheet |

```bash
pnpm --filter files start
```
