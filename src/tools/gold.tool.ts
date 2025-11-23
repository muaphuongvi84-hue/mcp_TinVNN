import { z } from "zod";
import type { ToolConfig } from "../types";
import { fetchHtml, loadHtml, safeText, resolveUrl } from "../utils/fetcher";


const ItemSchema = z.object({
title: z.string(),
url: z.string(),
source: z.string(),
category: z.string().optional(),
summary: z.string().nullable().optional(),
cover: z.string().nullable().optional(),
publishedAt: z.string().nullable().optional(),
content: z.string().nullable().optional(),
});


export default {
name: "trends-vn-gold",
description: "Lấy tin / giá vàng từ các nguồn chính thống VN (CafeF, VnExpress)",
inputSchema: z.object({}),
outputSchema: z.object({ items: z.array(ItemSchema) }),
execute: async () => {
const items: any[] = [];


// CafeF - chuyên mục giá vàng
try {
const base = "https://cafef.vn";
const html = await fetchHtml(`${base}/gia-vang.chn`);
const $ = loadHtml(html);


$(".listnews li, .boxContent .tabcontent li, .news li").each((i, el) => {
try {
const $el = $(el);
const a = $el.find("a").first();
const href = a.attr("href") || "";
const url = resolveUrl(base, href);
const title = safeText(a.text ? a.text() : a);
const summary = safeText($el.find("p").first().text ? $el.find("p").first().text() : null) || null;
if (title && url) {
items.push({ title, url, source: "cafef", category: "gold", summary, cover: null, publishedAt: null, content: null });
}
} catch (e) {}
});
} catch (e) {
// ignore
}


// VnExpress - fallback
try {
const base = "https://vnexpress.net";
const html = await fetchHtml(`${base}/tin-tuc/gia-vang`);
const $ = loadHtml(html);
$(".list-news .item-news, article.item-news").each((i, el) => {
try {
const $el = $(el);
const a = $el.find("a[href]").first();
const url = resolveUrl(base, a.attr("href") || "");
const title = safeText(a.text ? a.text() : a);
const summary = safeText($el.find("p").first().text ? $el.find("p").first().text() : null) || null;
const cover = $el.find("img").attr("data-src") || $el.find("img").attr("src") || null;
if (title && url) items.push({ title, url, source: "vnexpress", category: "gold", summary, cover, publishedAt: null, content: null });
} catch (e) {}
});
} catch (e) {}


// dedupe by url and limit
const unique = Array.from(new Map(items.map((it) => [it.url, it])).values()).slice(0, 30);
return { items: unique };
},
} satisfies ToolConfig;
