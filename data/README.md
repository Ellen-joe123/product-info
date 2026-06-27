# data 目录说明

本目录存放 SN 查询的**产品料号数据**。

## 维护人员请看这里

| 文件 | 作用 |
|------|------|
| `products.json` | **维护人员编辑此文件**（含 `_meta` 说明） |
| `products.js` | 由 `products.json` 自动生成，供网页加载，**不要手动改** |

## 如何添加新 SN 码

详细步骤请参阅：**[README.md](../README.md)**（与 `docs/如何添加SN码.md` 内容相同）

### 快速步骤

1. 编辑 `products.json`
2. 在 `newRules`（新款）或 `oldRules`（旧款）或 `exceptions`（特例）中追加一条
3. Commit 到 `main` 分支（CI 会检查 `products.js` 是否与 `products.json` 同步）
4. 约 1～2 分钟后在 https://sn.zephyrsz.com 验证

本地修改 `products.json` 后，需运行 `node tools/sync-products.js` 生成 `products.js`。

### 新增一条（模板）

**新款 SN → `newRules`：**

```json
{
  "prefix": "Z5801G",
  "model": "ZEPHYR RTX 5080 16G 深渊"
}
```

**特例 SN → `exceptions`：**

```json
{
  "sn": "完整序列号",
  "model": "产品型号",
  "dateText": "2024年第42周"
}
```

> `products.json` 顶部有 `_meta` 字段，内含简要说明（JSON 不支持 `//` 注释，故用 `_meta` 代替）。
