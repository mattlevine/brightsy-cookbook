/**
 * Webhooks: list, optional test POST (webhooks.test).
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
  printHeader('Webhooks cheatsheet');
  console.log(`
  await client.webhooks.list();
  await client.webhooks.get(webhookId);
  await client.webhooks.create({ /* ... */ });
  await client.webhooks.update(webhookId, { /* ... */ });
  await client.webhooks.delete(webhookId);
  await client.webhooks.test(webhookId);
`);
}

async function main() {
  const client = requireEnv();
  printHeader('Webhooks');

  const hooks = await client.webhooks.list();
  console.log(`webhooks.list: ${hooks.length} configured.`);
  if (hooks[0]) {
    console.log('Sample ids:', hooks.slice(0, 5).map((h) => h.id || h.webhook_id).filter(Boolean).join(' | '));
  }

  const webhookId = process.env.BRIGHTSY_WEBHOOK_ID || hooks[0]?.id;
  if (!webhookId) {
    console.log('No webhooks; create in CMS or set BRIGHTSY_WEBHOOK_ID.');
    process.exit(0);
  }

  if (process.env.BRIGHTSY_RUN_WEBHOOK_TEST === '1') {
    const result = await client.webhooks.test(webhookId);
    console.log('webhooks.test keys:', Object.keys(result || {}));
  } else {
    console.log(`Webhook id ${webhookId}. BRIGHTSY_RUN_WEBHOOK_TEST=1 calls webhooks.test() (POSTs to your URL).`);
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
