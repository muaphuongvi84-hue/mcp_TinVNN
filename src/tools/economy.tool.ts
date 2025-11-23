import { z as z5 } from "zod";
import type { ToolConfig as TC5 } from "../types";
import { fetchHtml as fh5, loadHtml as lh5, safeText as st5, resolveUrl as ru5 } from "../utils/fetcher";


const Item5 = z5.object({
title: z5.string(),
url: z5.string(),
source: z5.string(),
category: z5.string().optional(),
summary: z5.string().nullable().optional(),
cover: z5.string().nullable().optional(),
publishedAt: z5.string().nullable().optional(),
content: z5.string().nullable().optional(),
});


export default {
name: "trends-vn-economy",
description: "Lấy tin kinh tế (Cafef, VnEconomy, VnExpress Kinh Doanh)",
inputSchema: z5.object({}),
outputSchema: z5.object({ items: z5.array(Item5) }),
execute: async () => {
const results: any[] = [];


try {
const base = "https://cafef.vn";
const html = await fh5(base);
const $ = lh5(html);
$(".boxArticleList .article, .listnews li, .listnews .news-item").each((i, el) => {
try {
const $el = $(el);
const a = $el.find("a").first();
const href = a.attr("href") || "";
const url = ru5(base, href);
const title = st5(a.text ? a.text() : a);
if (title && url) results.push({ title, url, source: "cafef", category: "economy", summary: null, cover: null, publishedAt: null, content: null });
} catch (e) {}
});
} catch (e) {}


try {
const base = "https://vneconomy.vn";
const html = await fh5(base);
const $ = lh5(html);
$(".list-article .article, .module-list li").each((i, el) => {
try {
const $el = $(el);
const a = $el.find("a").first();
const href = a.attr("href") || "";
const url = ru5(base, href);
const title = st5(a.text ? a.text() : a);
if (title && url) results.push({ title, url, source: "vneconomy", category: "economy", summary: null, cover: null, publishedAt: null, content: null });
} catch (e) {}
});
} catch (e) {}


try {
const base = "https://vnexpress.net";
const html = await fh5(`${base}/kinh-doanh`);
const $ = lh5(html);
$(".list-news .item-news, article.item-news").each((i, el) => {
try {
const $el = $(el);
const a = $el.find("a[href]").first();
const url = ru5(base, a.attr("href") || "");
const title = st5(a.text ? a.text() : a);
if (title && url) results.push({ title, url, source: "vnexpress", category: "economy", summary: null, cover: null, publishedAt: null, content: null });
} catch (e) {}
});
} catch (e) {}


const unique = Array.from(new Map(results.map((r) => [r.url, r])).values()).slice(0, 60);
return { items: unique };
},
} satisfies TC5;
