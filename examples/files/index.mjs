/**
 * Account file storage: list, signedUrl, uploadTemp.
 * See README.md
 */
import { BrightsyClient } from '@brightsy/client';

function printHeader(title) {
  console.log(`\n=== ${title} ===\n`);
}

function requireEnv() {
  const apiKey = process.env.BRIGHTSY_API_KEY;
  const accountId = process.env.BRIGHTSY_ACCOUNT_ID;
  if (!apiKey || !accountId) {
    console.log('Set BRIGHTSY_API_KEY and BRIGHTSY_ACCOUNT_ID. See README.md');
    process.exit(0);
  }
  return new BrightsyClient({ api_key: apiKey, account_id: accountId });
}

function printCheatsheet() {
  printHeader('Files API cheatsheet');
  console.log(`
  await client.files.list({ path: 'public', search: 'report' });
  await client.files.createFolder({ path: 'public', folderName: 'imports' });
  await client.files.uploadUrl({ path: 'public/docs', filename: 'readme.txt' });
  await client.files.upload({ path: 'public/docs', filename: 'notes.txt', file: Buffer.from('hello') });
  await client.files.uploadTemp({ file: Buffer.from('x'), filename: 'scratch.txt' });
  await client.files.signedUrl({ path: 'public/docs/readme.txt', expiresIn: 3600 });
  await client.files.move('public/old.txt', 'public/archive/old.txt');
  await client.files.delete('public/docs/readme.txt');
`);
}

async function main() {
  const client = requireEnv();
  printHeader('Files');

  const listOpts = {};
  if (process.env.BRIGHTSY_FILES_PATH) listOpts.path = process.env.BRIGHTSY_FILES_PATH;
  if (process.env.BRIGHTSY_FILES_SEARCH) listOpts.search = process.env.BRIGHTSY_FILES_SEARCH;
  const files = await client.files.list(Object.keys(listOpts).length ? listOpts : undefined);
  console.log(`files.list: ${files.length} item(s).`);
  if (files[0]) {
    console.log(
      'Sample:',
      files.slice(0, 3).map((f) => f.path || f.name || f.key || JSON.stringify(f).slice(0, 60)).join(' | '),
    );
  }

  const signedPath = process.env.BRIGHTSY_FILES_SIGNED_PATH;
  if (signedPath) {
    const signed = await client.files.signedUrl({
      path: signedPath,
      expiresIn: Number(process.env.BRIGHTSY_FILES_SIGNED_TTL || 300),
    });
    console.log('signedUrl keys:', Object.keys(signed || {}));
  } else {
    console.log('Set BRIGHTSY_FILES_SIGNED_PATH to demo signedUrl().');
  }

  if (process.env.BRIGHTSY_RUN_FILE_UPLOAD === '1') {
    const body = Buffer.from(`cookbook ${new Date().toISOString()}\n`, 'utf8');
    const up = await client.files.uploadTemp({ file: body, filename: 'cookbook-probe.txt' });
    console.log('uploadTemp:', { path: up.path, fileUrl: (up.fileUrl || '').slice(0, 72) + '...' });
  } else {
    console.log('BRIGHTSY_RUN_FILE_UPLOAD=1 runs uploadTemp() to public/.temp');
  }

  if (process.env.BRIGHTSY_VERBOSE === '1') {
    printCheatsheet();
  }
  console.log('\nDone.\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
