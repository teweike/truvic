# 机型详情页模板（已确认保留）

用户于 2026-11-23 确认：这套版式保留，等以后要加详情页时直接套用此模板。

## 文件

- `_tools/templates/detail-page-template.html` — 可直接打开的完整样页（以 Extruded Fin Tube Machine 为例，单文件内联 CSS，含桌面/移动响应式断点 900px 与 520px）
- `_tools/templates/reference/` — 版式参考截图（桌面整页、移动端上半/下半、图集区）

## 版式结构（按顺序）

1. 面包屑：Home / Products / 类目 / 机型名
2. Hero 左右分栏：
   - 左：产线胶囊标签 → H1 机型名 → 一段工艺描述 → 4 个参数 chip → 主 CTA「Get Factory Quote」+ 次 CTA「WhatsApp an Engineer」→ 三条信任行（1 business day 回复 / 胶合板出口包装 / 12 months 保修 + 备件清单）
   - 右：16:9 图，底色 `#eef2f5`，与全站卡片一致
3. Key specifications：8 行两列参数表（`td.k` 34% 宽），表下小字注明“以形式发票为准”
4. Machine and finished tube：4 格 16:9 图集（整机 / 成品 / 细节 / 应用），缺图时用虚线占位格并标注 “to be supplied”
5. Why this machine pays back：3 张卖点卡（图标 + 小标题 + 2–3 行说明）
6. Buyer questions：3 条可折叠 FAQ（用 `<details>`，首条默认展开）
7. Other machines in this line：3 张同产线卡片（图 + 产线小标签 + 机型名 + 一句话）
8. 深绿询盘条（`#14332a`）：标题 + 一行提示 + 两个按钮
9. 页脚一行地址/邮箱

## 设计规范

- 主色 `#14332a`，橙 `#c2410c`，图片底色 `#eef2f5`，正文 `#5b6b66`，边框 `#e3e9e7`
- 字体 Inter；H1 42px（移动 30px）；H2 27px；正文 13–15.5px
- 圆角：图卡 16–22px，按钮胶囊 44px，区块 18–24px
- 图片一律 16:9、`object-fit:contain`

## 批量生成注意事项

- 每个机型配独立 `<title>`、`description`、`canonical`、`og:image`（1200×628）与 `Product` 结构化数据
- 卡片图用 `image/thumbs/**` 720px WebP，hero 与图集用 1600px 版本，均保留 PNX/PNG 回退链
- 参数表当前为示范值，必须替换为真实数据后再上线
