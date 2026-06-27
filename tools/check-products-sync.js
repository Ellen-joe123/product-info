const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../data/products.json');
const jsPath = path.join(__dirname, '../data/products.js');

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const expected =
  '// 自动生成，请勿直接编辑。\n' +
  '// 维护人员只需修改 products.json；提交后 CI 会自动更新本文件。\n\n' +
  'window.PRODUCTS_DATA = ' +
  JSON.stringify(data, null, 2) +
  ';\n';

const actual = fs.readFileSync(jsPath, 'utf8');

if (actual !== expected) {
  console.error('data/products.js 与 products.json 不一致');
  console.error('请运行：node tools/sync-products.js');
  process.exit(1);
}

console.log('products.js 与 products.json 同步一致');
