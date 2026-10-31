# 豪然形象手册

个人穿搭与审美训练手册：25 套带拆解的穿搭灵感、灵感墙、二选一眼力训练、配色实验、九节审美课，以及买衣服、选眼镜、理发前的参考。

- `artifact.html`：页面源文件（同时用于 Claude Artifact 版本）
- `index.html`：GitHub Pages 用的页面，由 `./build.sh` 从 `artifact.html` 生成——**改完 artifact.html 记得先跑一次 `./build.sh`**
- `thumbs.py`：给街拍生成 480px 缩略图到 `photos/s/`（`./build.sh` 会自动跑，需要 Pillow）
- `photos/`：Unsplash 授权街拍，选图标准与来源见 `photos/CREDITS.md`（新增照片必须先过标准）
- `proxy/worker.js`：可选的 AI 请求转发（Cloudflare Workers）

## 装到手机上

用手机浏览器打开 GitHub Pages 网址，选「添加到主屏幕」（iPhone 在 Safari 分享菜单里），之后就像 App 一样全屏打开，没网也能看（`sw.js` 负责离线缓存）。

## 数据

网页版的数据只存在本浏览器。换设备前在「我的档案 → 备份」导出备份文件（含衣橱和灵感墙照片），在新设备上导入即可。在 Claude 中打开时会同步到你的 Claude 账号。

## AI（问顾问、照片识别档案）

在「问顾问」页选一家模型并填自己的 API 密钥。密钥只存在本机浏览器，不进备份。

| 服务商 | 网页直连 | 能看图 |
| --- | --- | --- |
| Claude 内置（在 Claude 中打开） | ✓ 免密钥 | ✓ |
| Anthropic Claude / Google Gemini / DeepSeek / 智谱 / OpenRouter | ✓ | DeepSeek 不能 |
| OpenAI / 通义千问 / Kimi | ✗ 需代理 | ✓ |
| 自定义（OpenAI 兼容、本地 Ollama） | 视接口而定 | 视模型而定 |

需要代理时：在 Cloudflare 后台新建一个 Worker，粘贴 `proxy/worker.js`（把 `ALLOWED_ORIGINS` 改成你的 Pages 地址），部署后把 `https://xxx.workers.dev` 填进设置里的「代理地址」。

「我的衣橱」可以拍照登记：照片自动取主色，有 AI 时还会识别名称、类别和材质；照片存在本机浏览器（IndexedDB）。衣服照片可以一键去背景（本机处理，适合平铺或挂墙拍的照片，不满意能还原）。首页的「今天穿什么」每天用衣橱里的衣服按个人色板配一套，填上城市后还会按当天体感温度和降水决定外套厚薄、避开怕雨的鞋（天气来自免费的 Open-Meteo），点「就穿这套」会记下穿着次数。

「我的档案」页可以上传正脸照和全身照：AI 识别脸型、体型、肤色冷暖、发质等，逐项勾选后填入；不用 AI 时，也能在照片上点选取色判断冷暖、点 8 个点量脸型，全部在本机完成。
