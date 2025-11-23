import { z } from 'zod';
import { defineToolConfig, getRssItems } from '../utils';

const sources = {
  // ưu tiên nguồn có RSS bảng giá / chuyên mục giá vàng
  cafef: 'https://cafef.vn/rss/gia-vang.rss',
  vnexpress: 'https://vnexpress.net/rss/tin-noi-bat.rss', // fallback: dùng RSS tin nổi bật (hoặc tag giá vàng nếu available)
  thanhnien: 'https://thanhnien.vn/rss/home.rss',
};

const schema = z.object({
  source: z
    .union([z.literal('cafef'), z.literal('vnexpress'), z.literal('thanhnien')])
    .optional()
    .default('cafef'),
  limit: z.number().int().min(1).max(200).optional().default(20),
});

export default defineToolConfig({
  name: 'get-vn-gold',
  description: 'Lấy tin/giá vàng từ các nguồn chính thống Việt Nam (CafeF, VnExpress, ThanhNien).',
  zodSchema: schema,
  func: async (args) => {
    const { source, limit } = schema.parse(args);
    const url = sources[source];
    return getRssItems(url, { limit });
  },
});
