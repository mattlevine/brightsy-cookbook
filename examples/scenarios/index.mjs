/**
 * Scenarios: list, get, executions, trigger.
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

async function main() {
  const client = requireEnv();
  printHeader('Scenarios');

  const all = await client.scenarios.list();
  console.log(`scenarios.list: ${all.length} scenario(s).`);

  const first = all[0];
  if (first?.id) {
    const meta = await client.scenarios.get(first.id);
    console.log('scenarios.get keys:', Object.keys(meta || {}).slice(0, 12).join(', '));
    const exec = await client.scenarios.getExecutions(first.id, { page: 1, limit: 3 });
    console.log('getExecutions keys:', Object.keys(exec || {}));
  }

  const scenarioId = process.env.BRIGHTSY_SCENARIO_ID || first?.id;
  if (!scenarioId) {
    console.log('No scenarios; set BRIGHTSY_SCENARIO_ID to target one.');
    process.exit(0);
  }

  if (process.env.BRIGHTSY_SKIP_TRIGGER === '1') {
    console.log('BRIGHTSY_SKIP_TRIGGER=1; not calling scenarios.trigger().');
  } else {
    let input = {};
    if (process.env.BRIGHTSY_SCENARIO_INPUT) {
      try {
        input = JSON.parse(process.env.BRIGHTSY_SCENARIO_INPUT);
      } catch {
        input = { raw: process.env.BRIGHTSY_SCENARIO_INPUT };
      }
    }
    const run = await client.scenarios.trigger(scenarioId, { input });
    console.log('scenarios.trigger keys:', Object.keys(run || {}));
  }

  console.log('\nDone.\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
