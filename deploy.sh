#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
DIST_DIR="$ROOT_DIR/dist"

rm -rf "$DIST_DIR"
mkdir -p "$DIST_DIR"

cp "$ROOT_DIR/index.html" "$DIST_DIR/"
cp "$ROOT_DIR/style.css" "$DIST_DIR/"
cp "$ROOT_DIR/script.js" "$DIST_DIR/"

echo "✅ 构建完成：$DIST_DIR"
echo "你可以将 dist/ 中的文件上传到任意静态托管平台。"
