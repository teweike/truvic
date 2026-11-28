#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""TRUVIC 站点 SEO 底座注入脚本（幂等，可重复运行）
默认作用于当前目录下的 15 个页面。
"""
import re, os, sys, html

SITE = "https://teweikemachine.com"
MARK_S = "<!-- SEO-BASE -->"
MARK_E = "<!-- /SEO-BASE -->"

PAGES = {
    "index.html": dict(
        title="Processing Machinery Supplier in China | TRUVIC",
        desc="Welding, sheet-metal, tube, transformer, rim and paper processing machinery from China factories - factory-direct pricing, English engineer support.",
        og="image/og/og-brand.jpg", kind="home",
    ),
    "welding-machines.html": dict(
        title="Welding Machinery Supplier | MIG, TIG & Seam Welders | TRUVIC",
        desc="Spot, MIG/TIG and seam welders for sheet-metal and tube fabrication. Factory-direct pricing, English engineer support, shipped from China.",
        og="image/og/og-welding.jpg", kind="line", line="Welding Machinery",
    ),
    "sheet-metal-laser-machine.html": dict(
        title="Sheet-Metal & Laser Machinery | Fiber Laser Cutting | TRUVIC",
        desc="Fiber laser cutting, insulation board cutting and oscillating knife cutting machines for sheet metal - matched to your material and thickness.",
        og="image/og/og-sheet-metal.jpg", kind="line", line="Sheet-Metal and Laser Machinery",
    ),
    "fin-tube-processing-machine.html": dict(
        title="Fin Tube Processing Machinery | Extruded Fin Tube Machine | TRUVIC",
        desc="Extruded fin tube machines for heat exchanger tube production - fin height and pitch matched to your duty cycle, factory-direct pricing from China.",
        og="image/og/og-fin-tube.jpg", kind="line", line="Fin Tube Processing Machinery",
    ),
    "heat-exchanger-tube-processing-machine.html": dict(
        title="Heat Exchanger Tube Machinery | Straightening & Bending | TRUVIC",
        desc="Copper tube straightening, cutting and small U-bend return bending machines for heat exchanger production - factory-direct pricing, shipped from China.",
        og="image/og/og-heat-exchanger.jpg", kind="line", line="Heat Exchanger Tube Processing Machinery",
    ),
    "transformer-busbar-processing-machine.html": dict(
        title="Transformer & Busbar Machinery | Core Cutting, Busbar | TRUVIC",
        desc="Step-lap CRGO silicon steel core cutting and busbar punching, shearing and bending machines for transformer manufacturers - factory-direct from China.",
        og="image/og/og-transformer.jpg", kind="line", line="Transformer & Busbar Processing Machinery",
    ),
    "rim-machinery.html": dict(
        title="Wheel Rim Making Machinery | Flash Butt Welding | TRUVIC",
        desc="Wheel rim production machines: flash butt welding, roll forming, spoke spinning and hydraulic flaring for steel, alloy and motorcycle wheels.",
        og="image/og/og-rim.jpg", kind="line", line="Rim Making Machinery",
    ),
    "paper-plastic-machine.html": dict(
        title="Paper & Plastic Machinery | Cup, Bag & Lid Making | TRUVIC",
        desc="Paper cup, bag, lid and injection moulding machines for disposable packaging - speeds matched to your output per shift, factory-direct pricing from China.",
        og="image/og/og-paper-plastic.jpg", kind="line", line="Paper & Plastic Processing Machinery",
    ),
    "all-products.html": dict(
        title="All Processing Machinery | 30+ Machine Models | TRUVIC",
        desc="All seven TRUVIC lines in one place: welding, sheet-metal, fin tube, heat exchanger, transformer, rim and paper machinery - 30+ models.",
        og="image/og/og-welding.jpg", kind="list",
    ),
    "about.html": dict(
        title="About TRUVIC Machinery | China Processing Machinery Supplier",
        desc="TRUVIC Machinery sources processing machinery next to the builders across China, inspects every line before crating and ships worldwide.",
        og="image/og/og-brand.jpg", kind="page",
    ),
    "contact.html": dict(
        title="Contact TRUVIC Machinery | Quotes in 1 Business Day",
        desc="Send your spec - material, thickness, output per shift - and get a model recommendation with a factory-direct price within one business day.",
        og="image/og/og-brand.jpg", kind="page",
    ),
    "faq.html": dict(
        title="FAQ | MOQ, Lead Time, Payment & Warranty | TRUVIC Machinery",
        desc="Answers on minimum order quantity, lead time, payment terms, warranty, spare parts, shipping documents and installation support for TRUVIC machinery buyers.",
        og="image/og/og-brand.jpg", kind="page",
    ),
    "support.html": dict(
        title="Warranty, Shipping & Export Documents | TRUVIC Machinery",
        desc="Warranty terms, spare parts, installation guidance, and export documents: invoice, packing list, bill of lading, certificate of origin.",
        og="image/og/og-brand.jpg", kind="page",
    ),
    "privacy.html": dict(
        title="Privacy Policy | TRUVIC Machinery",
        desc="How TRUVIC Machinery collects, uses and protects enquiry data submitted through this website, and how to request access, correction or deletion.",
        og="image/og/og-brand.jpg", kind="page",
    ),
    "terms.html": dict(
        title="Terms of Sale | TRUVIC Machinery",
        desc="TRUVIC Machinery terms of sale: quotation validity, payment terms, lead time, packing, inspection, shipment, warranty and limitation of liability.",
        og="image/og/og-brand.jpg", kind="page",
    ),
}

ORG = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TRUVIC Machinery Co., Ltd.",
    "alternateName": "TRUVIC MACHINERY",
    "url": SITE + "/",
    "logo": SITE + "/image/og/icon-512.png",
    "image": SITE + "/image/og/og-brand.jpg",
    "email": "teweike@foxmail.com",
    "telephone": "+86-153-0077-7917",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": "No. 778 Siping Road, Hongkou District",
        "addressLocality": "Shanghai",
        "postalCode": "200092",
        "addressCountry": "CN",
    },
    "sameAs": ["https://www.youtube.com/@teweike-machine"],
    "description": "China-based supplier of processing machinery: welding, sheet metal, tube, transformer, rim and packaging lines, exported worldwide with factory-direct pricing.",
}


def j(obj):
    import json
    return json.dumps(obj, ensure_ascii=False, separators=(",", ":"))


def head_block(page, cfg, products):
    url = SITE + "/" + ("" if page == "index.html" else page)
    og_img = SITE + "/" + cfg["og"]
    t = html.escape(cfg["title"], quote=True)
    d = html.escape(cfg["desc"], quote=True)
    ld = [ORG]
    if cfg["kind"] == "home":
        ld.append({
            "@context": "https://schema.org", "@type": "WebSite",
            "name": "TRUVIC Machinery", "url": SITE + "/",
            "publisher": {"@type": "Organization", "name": "TRUVIC Machinery Co., Ltd."},
        })
    if products:
        ld.append({
            "@context": "https://schema.org", "@type": "ItemList",
            "name": cfg.get("line", cfg["title"]),
            "numberOfItems": len(products),
            "itemListElement": [
                {"@type": "ListItem", "position": i + 1, "name": n, "url": url}
                for i, n in enumerate(products)
            ],
        })
    ld_tags = "\n".join(f'<script type="application/ld+json">{j(x)}</script>' for x in ld)
    return f"""{MARK_S}
<meta name="description" content="{d}">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="{url}">
<link rel="icon" href="favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="TRUVIC Machinery">
<meta property="og:locale" content="en_US">
<meta property="og:title" content="{t}">
<meta property="og:description" content="{d}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{og_img}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="628">
<meta property="og:image:alt" content="{t}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{t}">
<meta name="twitter:description" content="{d}">
<meta name="twitter:image" content="{og_img}">
{ld_tags}
{MARK_E}"""


def strip_old(s):
    return re.sub(re.escape(MARK_S) + r".*?" + re.escape(MARK_E) + r"\n?", "", s, flags=re.S)


LOGO_H1 = re.compile(r'(<div class="logo">\s*)<h1>(.*?)</h1>', re.S)
LOGO_H1_ALT = re.compile(r'(<div class="logo">\s*)<h1>\s*(.*?)</h1>', re.S)


def fix_logo_h1(s):
    def rep(m):
        return m.group(1) + '<div class="logo-title">' + m.group(2) + "</div>"
    s2 = LOGO_H1.sub(rep, s, count=1)
    if s2 == s:
        s2 = LOGO_H1_ALT.sub(rep, s, count=1)
    return s2


def main(root="."):
    changed = []
    for page, cfg in PAGES.items():
        path = os.path.join(root, page)
        src = open(path, encoding="utf-8").read()
        s = strip_old(src)
        s = re.sub(r"<title>.*?</title>", "<title>" + html.escape(cfg["title"]) + "</title>", s, count=1, flags=re.S)
        products = re.findall(r'data-title="([^"]+)"', s)
        products = [html.unescape(p) for p in products]
        block = head_block(page, cfg, products if cfg["kind"] in ("line", "list") else [])
        s = s.replace("</head>", block + "\n</head>", 1)
        s = fix_logo_h1(s)
        if s != src:
            open(path, "w", encoding="utf-8").write(s)
            changed.append(page)
    print("updated:", len(changed))
    for c in changed:
        print("  ", c)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else ".")
