const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

function extractMapping(name) {
  const re = new RegExp(`var ${name} = \\{([\\s\\S]*?)\\};`);
  const m = html.match(re);
  if (!m) throw new Error(`not found ${name}`);
  const obj = {};
  for (const line of m[1].split('\n')) {
    const lm = line.match(/"([^"]+)":\s*"([^"]*)"/);
    if (lm) obj[lm[1]] = lm[2];
  }
  return obj;
}

const old = extractMapping('cardMapping');
const neu = extractMapping('newcardMapping');
const products = {
  oldRules: Object.entries(old).map(([prefix, model]) => ({ prefix, model })),
  newRules: Object.entries(neu).map(([prefix, model]) => ({ prefix, model })),
  exceptions: [
    {
      sn: 'LH3602231120000019',
      model: '浪花RTX3060 12G',
      dateText: '2024年第42周',
    },
  ],
};

const outDir = path.join(__dirname, '../data');
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, 'products.json'),
  JSON.stringify(products, null, 2) + '\n',
  'utf8'
);

console.log(`oldRules: ${products.oldRules.length}, newRules: ${products.newRules.length}`);
