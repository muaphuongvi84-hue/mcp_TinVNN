import { z } from 'zod';
import { defineToolConfig, getRssItems } from '../utils';

const sources = {
  tuoitre: 'https://tuoitre.vn/rss/tin-moi-nhat.rss',
  vnexpress: 'https://vnexpress.net/rss/tin-moi-nhat.rss',
  dantri: 'https://dantri.com.vn/ban-tin.rss',
};

const schema = z.object({
  source: z.union([z.literal('tuoitre'), z.literal('vnexpress'), z.literal('dantri')]).optional().default('vnexpress'),
  limit: z.number().int().min(1).max(200).optional().default(40),
});

export default defineToolConfig({
  name: 'get-vn-breaking',
  description: 'Lấy tin thời sự / tin mới nhất từ các trang báo lớn Việt Nam (TuoiTre, VnExpress, DanTri).',
  zodSchema: schema,
  func: async (args) => {
    const { source, limit } = schema.parse(args);
    const url = sources[source];
    return getRssItems(url, { limit });
  },
});
