"""统一街拍色调：轻微降饱和、抬起暗部、柔和高光、整体偏暖，和站点的米白纸色一致。
用法：python3 grade.py 原图目录 输出目录（新加照片时对新图跑一次，已调过的不要重复调）。"""
import os, sys
import numpy as np
from PIL import Image

def grade(im):
    a = np.asarray(im.convert('RGB')).astype(np.float32) / 255
    lum = a @ np.array([.299, .587, .114], dtype=np.float32)
    a = lum[..., None] + (a - lum[..., None]) * .86            # 饱和度 86%
    a = .045 + a * .93                                          # 黑位抬起、白位压一点，像印在纸上
    a = a + .06 * (a - .5) * (1 - np.abs(a - .5) * 2)           # 中间调轻微 S 曲线，保住层次
    a *= np.array([1.025, 1.0, .965], dtype=np.float32)        # 偏暖
    return Image.fromarray((np.clip(a, 0, 1) * 255 + .5).astype(np.uint8))

if __name__ == '__main__':
    src, dst = sys.argv[1], sys.argv[2]
    os.makedirs(dst, exist_ok=True)
    for f in sorted(os.listdir(src)):
        if f.endswith('.jpg'):
            grade(Image.open(os.path.join(src, f))).save(os.path.join(dst, f), quality=80, optimize=True, progressive=True)
