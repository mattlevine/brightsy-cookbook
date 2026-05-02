# Example: Files (account storage)

`client.files`: list objects, optional **signed read URL**, **uploadTemp** probe. See SDK `Client.ts` for `upload`, `uploadUrl`, `move`, `delete`, `createFolder`.

**Image AI** is separate: `client.images` (`analyze`, `suggestEdits`, `generate`).

## Code snippets

**Client**

```javascript
import { BrightsyClient } from '@brightsy/client';

const client = new BrightsyClient({
  api_key: process.env.BRIGHTSY_API_KEY,
  account_id: process.env.BRIGHTSY_ACCOUNT_ID,
});
```

**List and signed URL**

```javascript
const files = await client.files.list({ path: 'public', search: 'report' });

const signed = await client.files.signedUrl({
  path: process.env.BRIGHTSY_FILES_SIGNED_PATH,
  expiresIn: Number(process.env.BRIGHTSY_FILES_SIGNED_TTL || 300),
});
```

**Upload helpers**

```javascript
await client.files.uploadTemp({
  file: Buffer.from(`probe ${new Date().toISOString()}\n`),
  filename: 'cookbook-probe.txt',
});

await client.files.uploadUrl({ path: 'public/docs', filename: 'readme.txt' });
await client.files.upload({
  path: 'public/docs',
  filename: 'notes.txt',
  file: Buffer.from('hello'),
});
await client.files.createFolder({ path: 'public', folderName: 'imports' });
await client.files.move('public/old.txt', 'public/archive/old.txt');
await client.files.delete('public/docs/readme.txt');
```

Full runnable script: [`index.mjs`](index.mjs).

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
