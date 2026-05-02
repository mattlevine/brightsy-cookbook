/**
 * Agents: list, get, stateless complete().
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
  printHeader('Agents');

  const { data, total } = await client.agents.list({ include_models: false });
  console.log(`agents.list: total=${total}, rows=${data.length}`);

  const agentId = process.env.BRIGHTSY_AGENT_ID || data[0]?.id;
  if (!agentId) {
    console.log('Set BRIGHTSY_AGENT_ID or ensure at least one agent exists.');
    process.exit(0);
  }

  const agent = await client.agents.get(agentId);
  console.log('agents.get keys (sample):', Object.keys(agent || {}).slice(0, 15).join(', '));

  if (process.env.BRIGHTSY_SKIP_COMPLETE === '1') {
    console.log('BRIGHTSY_SKIP_COMPLETE=1 set; skipping agent().complete().');
    console.log('\nDone.\n');
    return;
  }

  const completion = await client.agent(agentId).complete({
    messages: [{ role: 'user', content: 'Reply with one short sentence.' }],
    max_tokens: 80,
  });
  let text = '';
  if (completion && typeof completion === 'object') {
    if (typeof completion.message === 'string') text = completion.message;
    else if (completion.choices?.[0]?.message?.content) text = completion.choices[0].message.content;
    else text = JSON.stringify(completion).slice(0, 280);
  }
  console.log('complete() (truncated):', String(text).slice(0, 400));
  console.log('\nDone.\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
