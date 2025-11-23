import { z as z3 } from "zod";
execute: async () => {
const results: any[] = [];


// VnExpress - the thao
try {
const base = "https://vnexpress.net";
const html = await fh3(`${base}/the-thao`);
const $ = lh3(html);
$(".list-news .item-news, article.item-news, .box-news .news-item").each((i, el) => {
try {
const $el = $(el);
const a = $el.find("a[href]").first();
const url = ru3(base, a.attr("href") || "");
const title = st3(a.text ? a.text() : a);
const summary = st3($el.find("p").first().text ? $el.find("p").first().text() : null) || null;
const cover = $el.find("img").attr("data-src") || $el.find("img").attr("src") || null;
if (title && url) results.push({ title, url, source: "vnexpress", category: "sports", summary, cover, publishedAt: null, content: null });
} catch (e) {}
});
} catch (e) {}


// TuoiTre - the thao
try {
const base = "https://tuoitre.vn";
const html = await fh3(`${base}/the-thao.htm`);
const $ = lh3(html);
$(".box-news .news-item, .list-news .news-item").each((i, el) => {
try {
const $el = $(el);
const a = $el.find("a").first();
const url = ru3(base, a.attr("href") || "");
const title = st3(a.text ? a.text() : a);
if (title && url) results.push({ title, url, source: "tuoitre", category: "sports", summary: null, cover: null, publishedAt: null, content: null });
} catch (e) {}
});
} catch (e) {}


// DanTri - the thao
try {
const base = "https://dantri.com.vn";
const html = await fh3(`${base}/the-thao.htm`);
const $ = lh3(html);
$(".news-item, .article-list__item").each((i, el) => {
try {
const $el = $(el);
const a = $el.find("a").first();
const url = ru3(base, a.attr("href") || "");
const title = st3(a.text ? a.text() : a);
if (title && url) results.push({ title, url, source: "dantri", category: "sports", summary: null, cover: null, publishedAt: null, content: null });
} catch (e) {}
});
} catch (e) {}


const unique = Array.from(new Map(results.map((r) => [r.url, r])).values()).slice(0, 50);
return { items: unique };
},
} satisfies TC3;
