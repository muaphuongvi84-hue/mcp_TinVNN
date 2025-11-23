import { z } from 'zod';
import { defineToolConfig, getRssItems } from '../utils';

const sources = {
  vnexpress: 'https://vnexpress.net/rss/the-thao.rss',
  tuoitre: 'https://tuoitre.vn/rss/the-thao.rss',
  dantri: 'https://dantri.com.vn/the-thao.rss',
};

const schema = z.object({
  source: z.union([z.literal('vnexpress'), z.literal('tuoitre'), z.literal('dantri')]).optional().default('vnexpress'),
  limit: z.number().int().min(1).max(200).optional().default(30),
});

export default defineToolConfig({
  name: 'get-vn-sports',
  description: 'Lấy tin thể thao từ VnExpress, TuoiTre, DanTri (RSS ưu tiên khi có).',
  zodSchema: schema,
  func: async (args) => {
    const { source, limit } = schema.parse(args);
    const url = sources[source];
    return getRssItems(url, { limit });
  },
});
