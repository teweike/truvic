# -*- coding: utf-8 -*-
"""
生成 all-products.html（All Products 总览页）：每个产线取前 3 张产品卡。

以后新增机器：直接在对应类目页里加 product-card，然后重跑本脚本即可。
自动规则：
  · 卡片数 > 3 的产线，区块右上自动出现 “View all →” 走到类目页；
  · 卡片数 <= 3 时不出现任何多余入口；
  · 每个品类下不再输出 “View more” 按钮。

用法：python3 _tools/gen_all_products.py
"""
import re
import os
import html

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# (文件, 胶囊短名, 图标) —— 胶囊用短名，区块标题用页面 H1 全名
LINES = [
    ("welding-machines.html", "Welding & Cutting", "fa-bolt"),
    ("sheet-metal-laser-machine.html", "Sheet Metal & Laser", "fa-vector-square"),
    ("fin-tube-processing-machine.html", "Fin Tube Processing", "fa-grip-lines"),
    ("heat-exchanger-tube-processing-machine.html", "Heat Exchanger Tube", "fa-temperature-high"),
    ("transformer-busbar-processing-machine.html", "Transformer & Busbar", "fa-bolt-lightning"),
    ("rim-machinery.html", "Rim Making", "fa-circle-notch"),
    ("paper-plastic-machine.html", "Paper & Plastic", "fa-box-open"),
]

CARD_RE = re.compile(r'<div class="product-card".*?Get Quote.*?</div>\s*</div>', re.S)

# 各产线一句话描述（≤15 词，只讲这条产线做什么，不列具体机型）
DESC = {
    "welding-machines.html": "Spot, MIG/TIG and automated welding lines for sheet-metal and tube fabrication.",
    "sheet-metal-laser-machine.html": "Laser cutting and sheet-metal forming equipment for precision fabrication workshops.",
    "fin-tube-processing-machine.html": "Fin tube processing equipment for heat exchanger and condenser tube production.",
    "heat-exchanger-tube-processing-machine.html": "Tube processing lines for heat exchangers, condensers and HVAC coil production.",
    "transformer-busbar-processing-machine.html": "Core and busbar processing equipment for transformer and switchgear manufacturing.",
    "rim-machinery.html": "Wheel rim forming and flaring equipment for automotive and wheel producers.",
    "paper-plastic-machine.html": "Paper and plastic converting machines for cups, bags, lids and packaging.",
}

BANNER = """<section class="page-banner all-banner">
<div class="container">
<nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span class="crumb-sep">/</span><span class="crumb-current">All Products</span></nav>
<h1>All Processing Machinery</h1>
</div>
</section>"""


def read_line(fn):
    src = open(os.path.join(ROOT, fn)).read()
    cards = CARD_RE.findall(src)
    h1s = re.findall(r'<h1[^>]*>(.*?)</h1>', src, re.S)
    name = next(h.strip() for h in h1s if "TRUVIC" not in h)
    body_line = re.search(r'<body data-line="(.*?)"', src).group(1)
    dm = re.search(r'</h1>\s*<p>(.*?)</p>', src, re.S)
    desc = re.sub(r'\s+', ' ', dm.group(1)).strip() if dm else ""
    return {
        "file": fn,
        "name": html.unescape(name),
        "line": html.unescape(body_line),
        "desc": DESC.get(fn, html.unescape(desc)),
        "cards": cards,
        "n": len(cards),
    }


DATA = [read_line(fn) for fn, _, _ in LINES]


def section_html(d):
    view_all = ""
    if d["n"] > 3:
        view_all = ('<a class="section-link" href="%s">View all '
                    '<i class="fas fa-arrow-right"></i></a>' % d["file"])
    desc_html = ('<p class="section-desc">%s</p>' % d["desc"]) if d["desc"] else ""
    cards = "\n".join(d["cards"][:3])
    return (
        '<section class="product-section" data-line="%s">\n'
        '<div class="section-head">\n'
        '<div>\n'
        '<h2>%s</h2>\n'
        '%s\n'
        '</div>\n'
        '%s\n'
        '</div>\n'
        '<div class="product-grid">\n'
        '%s\n'
        '</div>\n'
        '</section>'
    ) % (html.escape(d["line"], quote=True), html.escape(d["name"]),
         desc_html, view_all, cards)


def build():
    chips = "\n".join(
        '<a class="line-chip" href="%s"><i class="fas %s"></i>%s</a>'
        % (d["file"], icon, html.escape(short))
        for d, (_, short, icon) in zip(DATA, LINES))

    listing = (
        '<section class="product-list all-products-list">\n'
        '<div class="container">\n'
        '<div class="line-chips">\n' + chips + '\n</div>\n\n'
        + "\n\n".join(section_html(d) for d in DATA) +
        '\n'
    )

    shell = open(os.path.join(ROOT, "paper-plastic-machine.html")).read()
    shell = shell.replace(
        "<title>Paper & Plastic Processing Machine | Machinery</title>",
        "<title>All Processing Machinery | TRUVIC MACHINERY</title>")
    shell = shell.replace(
        '<body data-line="Paper & Plastic Processing Machine">',
        '<body data-line="All Products">')
    shell = re.sub(r'<section class="page-banner">.*?</section>',
                   lambda m: BANNER, shell, count=1, flags=re.S)
    head, rest = shell.split('<section class="product-list">', 1)
    rest = rest.split('<div class="cta-band">', 1)
    shell = head + listing + '\n<div class="cta-band">' + rest[1]

    open(os.path.join(ROOT, "all-products.html"), "w").write(shell)
    print("已生成 all-products.html ; 卡片数：", {d["name"]: d["n"] for d in DATA})


build()
