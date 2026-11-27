机型详情页模板基准 = EBW 页（2026-11-24 版）

用法：复制本文件到 machines/<slug>/index.html，替换 title/description/canonical/OG、Product 与 BreadcrumbList 里的机型名、
hero 与各段图片路径、参数表数值、FAQ、相关机型 3 卡；页眉页脚与卡片/弹窗参数按钮逻辑无需改动。

结构要点：共用 css/product/style.css + 全站 navbar/footer（href 带 ../../）；
询盘 CTA 用 ../../index.html?machine=<型号>&line=<产线标准名>#contact-form；
对应卡片加 data-detail="machines/<slug>/" 后弹窗会自动出现 Full specifications 按钮。
