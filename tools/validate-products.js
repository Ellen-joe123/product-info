const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/products.json');
const errors = [];

function fail(message) {
  errors.push(message);
}

function validateRules(name, rules) {
  if (!Array.isArray(rules)) {
    fail(`${name} 必须是数组`);
    return;
  }

  const seen = new Set();

  rules.forEach((rule, index) => {
    const label = `${name}[${index}]`;

    if (!rule || typeof rule !== 'object') {
      fail(`${label} 必须是对象`);
      return;
    }

    if (!rule.prefix || typeof rule.prefix !== 'string' || !rule.prefix.trim()) {
      fail(`${label}.prefix 不能为空`);
    }

    if (!rule.model || typeof rule.model !== 'string' || !rule.model.trim()) {
      fail(`${label}.model 不能为空`);
    }

    if (rule.prefix && seen.has(rule.prefix)) {
      fail(`${name} 中存在重复 prefix: ${rule.prefix}`);
    }

    if (rule.prefix) {
      seen.add(rule.prefix);
    }
  });
}

function validateExceptions(exceptions) {
  if (!Array.isArray(exceptions)) {
    fail('exceptions 必须是数组');
    return;
  }

  const seen = new Set();

  exceptions.forEach((item, index) => {
    const label = `exceptions[${index}]`;

    if (!item || typeof item !== 'object') {
      fail(`${label} 必须是对象`);
      return;
    }

    if (!item.sn || typeof item.sn !== 'string' || !item.sn.trim()) {
      fail(`${label}.sn 不能为空`);
    }

    if (!item.model || typeof item.model !== 'string' || !item.model.trim()) {
      fail(`${label}.model 不能为空`);
    }

    if (!item.dateText || typeof item.dateText !== 'string' || !item.dateText.trim()) {
      fail(`${label}.dateText 不能为空`);
    }

    if (item.sn && seen.has(item.sn)) {
      fail(`exceptions 中存在重复 sn: ${item.sn}`);
    }

    if (item.sn) {
      seen.add(item.sn);
    }
  });
}

let data;

try {
  data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
} catch (error) {
  console.error('无法读取或解析 data/products.json');
  console.error(error.message);
  process.exit(1);
}

validateRules('oldRules', data.oldRules);
validateRules('newRules', data.newRules);
validateExceptions(data.exceptions || []);

if (data._meta && typeof data._meta !== 'object') {
  fail('_meta 必须是对象');
}

if (errors.length > 0) {
  console.error('products.json 校验失败:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log(
  `products.json 校验通过: oldRules=${data.oldRules.length}, newRules=${data.newRules.length}, exceptions=${data.exceptions.length}`
);
