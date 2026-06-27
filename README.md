# product-info

SN 码查询网站（GitHub Pages：https://sn.zephyrsz.com）

## 本地测试

浏览器不允许在 `file://` 下用 `fetch` 加载 `data/products.json`，不能直接双击 `index.html`。

在项目根目录启动本地 HTTP 服务后访问页面：

```bash
python -m http.server 8080
```

Windows 也可双击 `serve.bat`，然后在浏览器打开 http://localhost:8080
