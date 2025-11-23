import { z as z6 } from "zod";
import type { ToolConfig as TC6 } from "../types";
import { fetchHtml as fh6, loadHtml as lh6, safeText as st6, resolveUrl as ru6 } from "../utils/fetcher";


const Item6 = z6.object({
title: z6.string(),
url: z6.string(),
source: z6.string(),
category: z6.string().optional(),
summary: z6.string().nullable().optional(),
cover: z6.string().nullable().optional(),
publishedAt: z6.string().nullable().optional(),
content: z6.string().nullable().optional(),
});


export default {
name: "trends-vn-education",
description: "Lấy tin giáo dục từ VnExpress, TuoiTre, ThanhNien",
inputSchema: z6.object({}),
outputSchema: z6.object({ items: z6.array(Item6) }),
execute: async () => {
const results: any[] = [];


try {
const base = "https://vnexpress.net";
const html = await fh6(`${base}/giao-duc`);
const $ = lh6(html);
$(".list-news .item-news, article.item-news").each((i, el) => {
try {
const $el = $(el);
const a = $el.find("a[href]").first();
const url = ru6(base, a.attr("href") || "");
const title = st6(a.text ? a.text() : a);
if (title && url) results.push({ title, url, source: "vnexpress", category: "education", summary: null, cover: null, publishedAt: null, content: null });
} catch (e) {}
});
} catch (e) {}


try {
const base = "https://tuoitre.vn";
const html = await fh6(`${base}/giao-duc.htm`);
const $ = lh6(html);
$(".box-news .news-item, .list-news .news-item").each((i, el) => {
try {
const $el = $(el);
const a = $el.find("a").first();
const url = ru6(base, a.attr("href") || "");
const title = st6(a.text ? a.text() : a);
if (title && url) results.push({ title, url, source: "tuoitre", category: "education", summary: null, cover: null, publishedAt: null, content: null });
} catch (e) {}
});
} catch (e) {}


try {
const base = "https://thanhnien.vn";
const html = await fh6(`${base}/giao-duc/`);
const $ = lh6(html);
$(".box-news .item, .news-list .news-item").each((i, el) => {
try {
const $el = $(el);
const a = $el.find("a").first();
const url = ru6(base, a.attr("href") || "");
const title = st6(a.text ? a.text() : a);
if (title && url) results.push({ title, url, source: "thanhnien", category: "education", summary: null, cover: null, publishedAt: null, content: null });
} catch (e) {}
});
} catch (e) {}


const unique = Array.from(new Map(results.map((r) => [r.url, r])).values()).slice(0, 60);
return { items: unique };
},
} satisfies TC6;
