const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../data/products.json');
const jsPath = path.join(__dirname, '../data/products.js');

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

const header =
  '// 自动生成，请勿直接编辑。\n' +
  '// 请修改 products.json 后运行：node tools/sync-products.js\n' +
  '// 提交到 GitHub 后，CI 会自动同步本文件。\n\n';

const body = 'window.PRODUCTS_DATA = ' + JSON.stringify(data, null, 2) + ';\n';

fs.writeFileSync(jsPath, header + body, 'utf8');
console.log('已生成 data/products.js');
