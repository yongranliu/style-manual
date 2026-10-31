"""为 photos/ 里的街拍生成 480px 宽的缩略图到 photos/s/（列表和卡片用，放大时才加载原图）。build.sh 会自动调用。"""
import os
from PIL import Image

src, dst = 'photos', os.path.join('photos', 's')
os.makedirs(dst, exist_ok=True)
for f in sorted(os.listdir(src)):
    if not f.endswith('.jpg'):
        continue
    out = os.path.join(dst, f)
    if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(os.path.join(src, f)):
        continue
    im = Image.open(os.path.join(src, f)).convert('RGB')
    im.thumbnail((480, 720))
    im.save(out, quality=78, optimize=True, progressive=True)
# 删掉原图已经不在的缩略图
for f in os.listdir(dst):
    if not os.path.exists(os.path.join(src, f)):
        os.remove(os.path.join(dst, f))
