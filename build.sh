#!/bin/sh
# 由 artifact.html 生成 GitHub Pages 用的 index.html（补上文档头、App 清单和图标）
cd "$(dirname "$0")"
{ printf '<!doctype html>\n<html lang="zh-CN">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
  printf '<meta name="theme-color" content="#F5F2EC" media="(prefers-color-scheme: light)">\n<meta name="theme-color" content="#121110" media="(prefers-color-scheme: dark)">\n'
  printf '<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-title" content="形象手册">\n<meta name="apple-mobile-web-app-status-bar-style" content="default">\n'
  printf '<link rel="manifest" href="manifest.webmanifest">\n<link rel="icon" href="icons/favicon.png">\n<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">\n'
  printf '<style>[hidden]{display:none!important}body{margin:0}img{max-width:100%%}</style>\n</head>\n<body>\n'
  cat artifact.html
  printf '\n</body>\n</html>\n'; } > index.html
