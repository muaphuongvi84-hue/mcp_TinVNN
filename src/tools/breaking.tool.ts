import { z as z4 } from "zod";
import type { ToolConfig as TC4 } from "../types";
import { fetchHtml as fh4, loadHtml as lh4, safeText as st4, resolveUrl as ru4, delay as d4 } from "../utils/fetcher";


const Item4 = z4.object({
title: z4.string(),
url: z4.string(),
source: z4.string(),
category: z4.string().optional(),
summary: z4.string().nullable().optional(),
cover: z4.string().nullable().optional(),
publishedAt: z4.string().nullable().optional(),
content: z4.string().nullable().optional(),
});


export default {
name: "trends-vn-breaking",
description: "Lấy tin thời sự (breaking) từ các trang lớn: TuoiTre, VnExpress, DanTri",
inputSchema: z4.object({}),
outputSchema: z4.object({ items: z4.array(Item4) }),
execute: async () => {
const results: any[] = [];
const sites = [
{ base: "https://tuoitre.vn", path: "/" },
{ base: "https://vnexpress.net", path: "/" },
{ base: "https://dantri.com.vn", path: "/" },
];


for (const site of sites) {
try {
const html = await fh4(site.base + site.path);
const $ = lh4(html);
$("a[href]").slice(0, 80).each((i, el) => {
try {
const $el = $(el);
const href = $el.attr("href") || "";
if (!href) return;
if (href.startsWith("#") || href.match(/\.(pdf|jpg|png|gif)$/i)) return;
const url = ru4(site.base, href);
const title = st4($el.text() || null) || st4($el.attr("title") || null);
if (!title) return;
results.push({ title, url, source: new URL(site.base).hostname.replace(/www\.|\.com\.vn|\.vn/g, ""), category: "breaking", summary: null, cover: null, publishedAt: null, content: null });
} catch (e) {}
});
} catch (e) {}
await d4(200);
}


const unique = Array.from(new Map(results.map((r) => [r.url, r])).values()).slice(0, 60);
return { items: unique };
},
} satisfies TC4;
