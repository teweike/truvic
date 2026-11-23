#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""为产品卡图生成 720px 缩略 WebP（image/thumbs/...），卡片只加载缩略图，弹窗/预览用原图。"""
import re, os, glob
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)

WIDTH = 720
QUALITY = 74
METHOD = 6


def collect():
    paths = set()
    for f in glob.glob("*.html"):
        s = open(f, encoding="utf-8").read()
        paths.update(re.findall(r'data-lazy="([^"]+)"', s))
    return sorted(p for p in paths if p.startswith("image/"))


def thumb_path(p):
    rel = p[len("image/"):]
    return os.path.join("image/thumbs", os.path.splitext(rel)[0] + ".webp")


def main():
    total_before = total_after = 0
    n = 0
    for p in collect():
        if not os.path.exists(p):
            print("MISSING", p)
            continue
        src_full = os.path.splitext(p)[0] + ".webp"
        before = os.path.getsize(src_full) if os.path.exists(src_full) else os.path.getsize(p)
        im = Image.open(p).convert("RGBA")
        bg = Image.new("RGBA", im.size, (238, 242, 245, 255))
        im = Image.alpha_composite(bg, im).convert("RGB")
        if im.width > WIDTH:
            im = im.resize((WIDTH, round(im.height * WIDTH / im.width)), Image.LANCZOS)
        dst = thumb_path(p)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        im.save(dst, "WEBP", quality=QUALITY, method=METHOD)
        after = os.path.getsize(dst)
        total_before += before
        total_after += after
        n += 1
        print(f"{before/1024:8.1f}KB -> {after/1024:6.1f}KB   {dst}")
    print(f"\n{n} 张：{total_before/1048576:.2f} MB -> {total_after/1048576:.2f} MB，节省 {100-(total_after/total_before*100):.0f}%")


if __name__ == "__main__":
    main()
