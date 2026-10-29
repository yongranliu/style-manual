#!/bin/sh
# 由 artifact.html 生成 GitHub Pages 用的 index.html（补上文档头）
cd "$(dirname "$0")"
{ printf '<!doctype html>\n<html lang="zh-CN">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n<style>[hidden]{display:none!important}body{margin:0}img{max-width:100%%}</style>\n</head>\n<body>\n'; cat artifact.html; printf '\n</body>\n</html>\n'; } > index.html
