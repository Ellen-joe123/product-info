const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/products.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const output = {
  _meta: {
    说明: '本文件维护所有 SN 料号。提交到 main 分支后，GitHub Pages 约 1～2 分钟更新到 sn.zephyrsz.com',
    详细文档: 'docs/如何添加SN码.md',
    数组说明: {
      oldRules: '旧款 SN 料号（ZF、LH 等开头），字段：prefix + model',
      newRules: '新款 SN 料号（Z 开头，2025 年后），字段：prefix + model',
      exceptions: '特例 SN（整条固定匹配），字段：sn + model + dateText',
    },
    新增newRules示例: {
      prefix: 'Z5801G',
      model: 'ZEPHYR RTX 5080 16G 深渊',
    },
    新增oldRules示例: {
      prefix: 'ZF5801',
      model: 'ZEPHYR RTX 5080 16G 浪花',
    },
    新增exceptions示例: {
      sn: '完整序列号',
      model: '产品型号',
      dateText: '2024年第42周',
    },
    注意事项: [
      'JSON 标准不支持 // 注释，说明写在 _meta 中',
      '新增时在对应数组末尾追加，上一项末尾加英文逗号',
      '数组最后一项后面不要加逗号',
      'prefix 和 sn 区分大小写，不要有空格',
      '不要删除 _meta 本段',
    ],
  },
  ...data,
};

fs.writeFileSync(filePath, JSON.stringify(output, null, 2) + '\n', 'utf8');
console.log('Added _meta to products.json');
