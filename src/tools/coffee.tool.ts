import { z as z2 } from "zod";
import type { ToolConfig as TC2 } from "../types";
import { fetchHtml as fh2, loadHtml as lh2, safeText as st2, resolveUrl as ru2 } from "../utils/fetcher";


const Item2 = z2.object({
title: z2.string(),
url: z2.string(),
source: z2.string(),
category: z2.string().optional(),
summary: z2.string().nullable().optional(),
cover: z2.string().nullable().optional(),
publishedAt: z2.string().nullable().optional(),
content: z2.string().nullable().optional(),
});


export default {
name: "trends-vn-coffee",
description: "Lấy tin / giá cà phê từ các nguồn chính thống (CafeF, VietnamNet)",
inputSchema: z2.object({}),
outputSchema: z2.object({ items: z2.array(Item2) }),
execute: async () => {
const results: any[] = [];
try {
const base = "https://cafef.vn";
const html = await fh2(`${base}/gia-ca-phe.chn`);
const $ = lh2(html);
$(".listnews li, .boxContent .tabcontent li").each((i, el) => {
try {
const $el = $(el);
const a = $el.find("a").first();
const href = a.attr("href") || "";
const url = ru2(base, href);
const title = st2(a.text ? a.text() : a);
const summary = st2($el.find("p").first().text ? $el.find("p").first().text() : null) || null;
if (title && url) results.push({ title, url, source: "cafef", category: "coffee", summary, cover: null, publishedAt: null, content: null });
} catch (e) {}
});
} catch (e) {}


try {
const base = "https://vietnamnet.vn";
const html = await fh2(`${base}/kinh-doanh/`);
const $ = lh2(html);
$(".article--item, .box-news .item").each((i, el) => {
try {
const $el = $(el);
const a = $el.find("a").first();
const href = a.attr("href") || "";
const url = ru2(base, href);
const title = st2(a.text ? a.text() : a);
if (title && url) results.push({ title, url, source: "vietnamnet", category: "coffee", summary: null, cover: null, publishedAt: null, content: null });
} catch (e) {}
});
} catch (e) {}


const unique = Array.from(new Map(results.map((r) => [r.url, r])).values()).slice(0, 30);
return { items: unique };
},
} satisfies TC2;
