# 太阳系八大行星 3D 科普网站

一个开箱即用的静态 3D 科普页面（Three.js），支持拖拽、缩放、点击行星查看详情。

## 本地运行

```bash
python3 -m http.server 8080
```

打开浏览器访问：

- http://localhost:8080/index.html

## 一键部署（静态托管）

本项目是纯静态页面，可直接部署到任意静态托管平台：

- GitHub Pages
- Vercel（Static）
- Netlify
- Cloudflare Pages

### 使用 `deploy.sh` 快速打包

```bash
bash deploy.sh
```

执行后会生成 `dist/` 目录，里面包含可直接上传部署的文件。
