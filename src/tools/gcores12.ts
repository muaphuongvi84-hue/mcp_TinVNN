import { z } from 'zod';
import { defineToolConfig, getRssItems } from '../utils';

const sources = {
  vnexpress: 'https://vnexpress.net/rss/giao-duc.rss',
  tuoitre: 'https://tuoitre.vn/rss/giao-duc.rss',
  thanhnien: 'https://thanhnien.vn/rss/giao-duc.rss',
};

const schema = z.object({
  source: z.union([z.literal('vnexpress'), z.literal('tuoitre'), z.literal('thanhnien')]).optional().default('vnexpress'),
  limit: z.number().int().min(1).max(200).optional().default(30),
});

export default defineToolConfig({
  name: 'get-vn-education',
  description: 'Lấy tin giáo dục từ VnExpress, TuoiTre, ThanhNien (RSS ưu tiên).',
  zodSchema: schema,
  func: async (args) => {
    const { source, limit } = schema.parse(args);
    const url = sources[source];
    return getRssItems(url, { limit });
  },
});
