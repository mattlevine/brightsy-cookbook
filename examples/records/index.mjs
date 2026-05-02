/**
 * Record types + record querying: filters, aggregates, NL search.
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

function printCrudCheatsheet() {
  printHeader('CRUD cheatsheet (CMA draft)');
  console.log(`
  await client.cma.recordType(slug).save({ /* fields */ });
  await client.cma.recordType(slug).id(uuid).save({ /* partial */ });
  await client.cma.recordType(slug).id(uuid).delete();
  await client.cma.recordType(slug).id(uuid).publish();
  await client.cma.recordType(slug).id(uuid).unpublish();
`);
}

function printFilterAggregateCheatsheet() {
  printHeader('Filtering & aggregates cheatsheet');
  console.log(`
  // Operators: eq, neq, gt, gte, lt, lte, like, ilike, in, notIn, begins, ends
  client.cma.recordType(slug)
    .where('price', 'gte', 10)
    .and('status', 'eq', 'active')
    .or('title', 'ilike', '%report%')
    .where('id', 'in', 'uuid1,uuid2')   // CSV string for "in"
    .tags('featured', 'draft')
    .select('id', 'title', 'updated_at')
    .groupBy('category_id')
    .orderBy('updated_at', 'desc')
    .page(1).limit(20)
    .get();

  // Natural language (+ optional semantic / recency ranking on CDA)
  client.cda.recordType(slug)
    .nlSearch('Q4 revenue summary', 0.72)
    .withFreshness(14)
    .limit(10)
    .get();

  // Aggregates (combine with groupBy/select as supported by your API)
  client.cma.recordType(slug).count().get();
  client.cma.recordType(slug).sum('amount').avg('amount').get();

  // Batch by record IDs (same record type / endpoint family)
  client.cma.recordType(slug).getByIds(['uuid-a', 'uuid-b']);
`);
}

async function demoBasics(client, slug) {
  printHeader(`Records: basic list (slug="${slug}")`);
  const sampleUrl = client.cma
    .recordType(slug)
    .where('updated_at', 'gte', '1970-01-01')
    .orderBy('updated_at', 'desc')
    .page(1)
    .limit(5)
    .getUrl();
  console.log('Example list URL:', sampleUrl);

  const listed = await client.cma.recordType(slug).orderBy('updated_at', 'desc').page(1).limit(5).get();
  console.log(`CMA list: total≈${listed.pagination?.total ?? '?'}, rows=${listed.data?.length ?? 0}`);

  const recordId = process.env.BRIGHTSY_RECORD_ID;
  if (recordId) {
    const one = await client.cma.recordType(slug).id(recordId).get();
    console.log(`Single record ${recordId}:`, one.data?.[0] ? 'loaded' : String(one).slice(0, 120));
  } else {
    console.log('Set BRIGHTSY_RECORD_ID for .id(uuid).get() demo.');
  }

  const ids = process.env.BRIGHTSY_RECORD_IDS;
  if (ids) {
    const idList = ids.split(',').map((s) => s.trim()).filter(Boolean);
    if (idList.length) {
      try {
        const batch = await client.cma.recordType(slug).getByIds(idList);
        console.log(`getByIds(${idList.length}): rows=${batch.data?.length ?? 0}`);
      } catch (e) {
        console.log('getByIds error:', e.message);
      }
    }
  } else {
    console.log('Set BRIGHTSY_RECORD_IDS=id1,id2 for getByIds() batch demo.');
  }

  try {
    const pub = await client.cda.recordType(slug).limit(3).get();
    console.log('CDA published rows:', pub.data?.length ?? 0);
  } catch (e) {
    console.log('CDA list skipped:', e.message);
  }
}

async function demoAdvancedFilters(client, slug) {
  printHeader('Advanced filtering (multi where, tags, select)');
  const rt = client.cma.recordType(slug);

  const chain = rt
    .where('updated_at', 'gte', '2020-01-01T00:00:00.000Z')
    .and('updated_at', 'lte', new Date().toISOString())
    .orderBy('updated_at', 'desc')
    .page(1)
    .limit(10);

  const field = process.env.BRIGHTSY_FILTER_FIELD;
  const op = process.env.BRIGHTSY_FILTER_OP;
  const value = process.env.BRIGHTSY_FILTER_VALUE;
  if (field && op && value !== undefined) {
    chain.where(field, op, value);
    console.log(`Added filter: ${field} ${op} ${String(value).slice(0, 60)}`);
  } else {
    console.log('Optional: BRIGHTSY_FILTER_FIELD, BRIGHTSY_FILTER_OP, BRIGHTSY_FILTER_VALUE for an extra where().');
  }

  const tag = process.env.BRIGHTSY_RECORD_TAG;
  if (tag) {
    chain.tags(tag);
    console.log(`Applied tags(): ${tag}`);
  } else {
    console.log('Optional: BRIGHTSY_RECORD_TAG=slug for .tags() filter.');
  }

  const selectFields = process.env.BRIGHTSY_SELECT_FIELDS;
  if (selectFields) {
    chain.select(...selectFields.split(',').map((s) => s.trim()).filter(Boolean));
    console.log(`Applied select(): ${selectFields}`);
  } else {
    console.log('Optional: BRIGHTSY_SELECT_FIELDS=id,title,updated_at for field projection.');
  }

  console.log('Advanced query URL:', chain.getUrl());
  try {
    const res = await chain.get();
    console.log(`Advanced list: rows=${res.data?.length ?? 0}, total≈${res.pagination?.total ?? '?'}`);
  } catch (e) {
    console.log('Advanced filter request failed (check field names for your schema):', e.message);
  }
}

async function demoAggregates(client, slug) {
  printHeader('Aggregates (count / sum / avg / min / max)');
  try {
    const countUrl = client.cma.recordType(slug).where('updated_at', 'gte', '1970-01-01').count().page(1).limit(1).getUrl();
    console.log('Count aggregate URL:', countUrl);
    const countRes = await client.cma.recordType(slug).where('updated_at', 'gte', '1970-01-01').count().page(1).limit(5).get();
    console.log('count() response top-level keys:', Object.keys(countRes || {}));
    if (countRes.data) console.log('  data length:', countRes.data.length);
  } catch (e) {
    console.log('count() aggregate error:', e.message);
  }

  const sumField = process.env.BRIGHTSY_AGG_SUM_FIELD;
  if (sumField) {
    try {
      const url = client.cma.recordType(slug).sum(sumField).count().page(1).limit(1).getUrl();
      console.log(`sum("${sumField}") + count URL:`, url);
      const res = await client.cma.recordType(slug).sum(sumField).count().page(1).limit(5).get();
      console.log('sum+count keys:', Object.keys(res || {}));
    } catch (e) {
      console.log('sum() aggregate error (field may not exist or type may be non-numeric):', e.message);
    }
  } else {
    console.log('Optional: BRIGHTSY_AGG_SUM_FIELD=numeric_field_name for sum()+count() demo.');
  }

  const avgField = process.env.BRIGHTSY_AGG_AVG_FIELD;
  if (avgField) {
    try {
      const url = client.cma.recordType(slug).avg(avgField).count().page(1).limit(1).getUrl();
      console.log(`avg("${avgField}") + count URL:`, url);
      const res = await client.cma.recordType(slug).avg(avgField).count().page(1).limit(5).get();
      console.log('avg+count keys:', Object.keys(res || {}));
    } catch (e) {
      console.log('avg() aggregate error:', e.message);
    }
  } else {
    console.log('Optional: BRIGHTSY_AGG_AVG_FIELD=numeric_field for avg()+count() demo.');
  }

  const groupField = process.env.BRIGHTSY_AGG_GROUP_BY;
  if (groupField) {
    try {
      const res = await client.cma
        .recordType(slug)
        .groupBy(groupField)
        .count()
        .page(1)
        .limit(20)
        .get();
      console.log(`groupBy("${groupField}").count() keys:`, Object.keys(res || {}));
    } catch (e) {
      console.log('groupBy+count error:', e.message);
    }
  } else {
    console.log('Optional: BRIGHTSY_AGG_GROUP_BY=field for groupBy().count() (alias of select for aggregates).');
  }
}

async function demoNaturalLanguage(client, slug) {
  if (process.env.BRIGHTSY_TRY_NL !== '1') {
    console.log('\nTip: BRIGHTSY_TRY_NL=1 for CDA nlSearch + withFreshness demo.\n');
    return;
  }
  printHeader('Natural language search (CDA)');
  try {
    const q = client.cda
      .recordType(slug)
      .nlSearch(process.env.BRIGHTSY_NL_QUERY || 'recent updates', Number(process.env.BRIGHTSY_NL_THRESHOLD || 0.65))
      .withFreshness(Number(process.env.BRIGHTSY_NL_TIME_DECAY_DAYS || 14))
      .limit(Number(process.env.BRIGHTSY_NL_LIMIT || 5));
    console.log('NL URL:', q.getUrl());
    const nl = await q.get();
    console.log('CDA nl_query rows:', nl.data?.length ?? 0);
  } catch (e) {
    console.log('NL search error:', e.message);
  }
}

async function main() {
  const client = requireEnv();

  printHeader('Record types (CMA)');
  const types = await client.cma.listRecordTypes();
  console.log(`listRecordTypes: ${types.length} type(s).`);
  console.log('Sample slugs:', types.slice(0, 5).map((t) => t.slug || t.id).filter(Boolean).join(', ') || '(none)');

  const slug = process.env.BRIGHTSY_RECORD_TYPE_SLUG || types[0]?.slug;
  if (!slug) {
    console.log('No slug to query; set BRIGHTSY_RECORD_TYPE_SLUG.');
    process.exit(0);
  }
  if (!process.env.BRIGHTSY_RECORD_TYPE_SLUG && types[0]?.slug) {
    console.log(`Using first slug "${slug}" (override with BRIGHTSY_RECORD_TYPE_SLUG).`);
  }

  const detail = await client.recordTypes.get(slug);
  console.log(`getRecordType("${slug}") top-level keys:`, Object.keys(detail || {}).slice(0, 12).join(', '));

  await demoBasics(client, slug);
  await demoAdvancedFilters(client, slug);
  await demoAggregates(client, slug);
  await demoNaturalLanguage(client, slug);

  if (process.env.BRIGHTSY_VERBOSE === '1') {
    printCrudCheatsheet();
    printFilterAggregateCheatsheet();
  }
  console.log('Done.\n');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
