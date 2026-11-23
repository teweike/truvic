#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成 thank-you.html（由 contact.html 复制外壳，替换 banner 与正文）。"""
import re, os

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
src = open("contact.html", encoding="utf-8").read()

# 1) 标题
s = re.sub(r"<title>.*?</title>", "<title>Thank You | RFQ Received | TRUVIC Machinery</title>", src, count=1, flags=re.S)

# 2) head 里 SEO 块换成 noindex 版本
seo = """<!-- SEO-BASE -->
<meta name="description" content="Your RFQ has been received. TRUVIC replies with a model recommendation and factory-direct price within one business day, Mon-Fri 9:00-18:00 GMT+8.">
<meta name="robots" content="noindex,follow">
<link rel="icon" href="favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
<!-- /SEO-BASE -->"""
s = re.sub(r"<!-- SEO-BASE -->.*?<!-- /SEO-BASE -->", seo, s, count=1, flags=re.S)

# 3) banner
banner_new = """<section class="page-banner">
<div class="container">
<nav class="breadcrumb" aria-label="Breadcrumb"><a href="index.html">Home</a><span class="crumb-sep">/</span><span class="crumb-current">Thank You</span></nav>
<h1>Thank You — Your RFQ Is In</h1>
<p>A real engineer reads every inquiry. You will get a model recommendation and a factory-direct price within one business day, Mon–Fri 09:00–18:00 GMT+8.</p>
</div>
</section>"""
s = re.sub(r'<section class="page-banner">.*?</section>', banner_new, s, count=1, flags=re.S)

# 4) 正文
body_new = """<style>
.thanks-btn{display:inline-flex;align-items:center;gap:8px;padding:12px 22px;border-radius:44px;border:1.5px solid #14332a;color:#14332a;font-weight:700;font-size:.9rem;text-decoration:none;transition:.2s}
.thanks-btn:hover{background:#14332a;color:#fff}
.thanks-btn.wa{border-color:#25d366;color:#0d7a3d}
.thanks-btn.wa:hover{background:#25d366;color:#fff}
.content-page ul li a{color:#b3491a}
.content-page ul li a:hover{text-decoration:underline}
</style>

<section class="product-list content-page">
<div class="container">
<div class="content-wrap">

<h2>What happens next</h2>
<div class="info-card">
<p><strong>01 · Technical check.</strong> We match your material, thickness or tube size and output per shift to a specific model — not a catalogue page. If something is missing, we ask one short question instead of guessing.</p>
<p><strong>02 · Quote.</strong> You receive the price, scope of supply, lead time and packing details in one reply, so you can compare it against other suppliers directly.</p>
<p><strong>03 · Export follow-through.</strong> After the order: plywood-case packing, container loading plan, commercial invoice, packing list, bill of lading and certificate of origin — plus a spare-parts list.</p>
</div>

<h2>Did not see our reply?</h2>
<p>Our mail comes from a personal address, so it occasionally lands in spam. Please check the spam or promotions folder, and add our address to your safe senders.</p>
<p>If you need an answer sooner, message us on WhatsApp — it reaches the same engineer:</p>
<p><a href="https://wa.me/8615300777917" target="_blank" rel="noopener" class="thanks-btn wa"><i class="fab fa-whatsapp"></i> WhatsApp +86 153 0077 7917</a></p>

<h2>While you wait</h2>
<p>Have a look at the other lines — most buyers end up ordering a machine plus its upstream or downstream unit:</p>
<ul>
<li><a href="all-products.html">All Processing Machinery — 30+ machine models</a></li>
<li><a href="welding-machines.html">Welding Machinery</a></li>
<li><a href="sheet-metal-laser-machine.html">Sheet-Metal and Laser Machinery</a></li>
<li><a href="fin-tube-processing-machine.html">Fin Tube Processing Machinery</a></li>
<li><a href="heat-exchanger-tube-processing-machine.html">Heat Exchanger Tube Processing Machinery</a></li>
<li><a href="transformer-busbar-processing-machine.html">Transformer &amp; Busbar Processing Machinery</a></li>
<li><a href="rim-machinery.html">Rim Making Machinery</a></li>
<li><a href="paper-plastic-machine.html">Paper &amp; Plastic Processing Machinery</a></li>
</ul>

<p style="margin-top:2rem"><a href="index.html" class="thanks-btn"><i class="fas fa-house"></i> Back to Home</a></p>

</div>
</div>
</section>"""
s = re.sub(r'<section class="product-list content-page">.*?</section>\s*(?=<footer)', body_new + "\n\n", s, count=1, flags=re.S)

open("thank-you.html", "w", encoding="utf-8").write(s)
print("thank-you.html written", len(s), "bytes")
