import { z } from 'zod';
import { defineToolConfig, getRssItems } from '../utils';

const sources = {
  cafef: 'https://cafef.vn/rss/gia-ca-phe.rss', // nếu site có feed chuyên mục
  vietnamnet: 'https://vietnamnet.vn/rss/kinh-doanh.rss',
  dantri: 'https://dantri.com.vn/kinh-doanh.rss',
};

const schema = z.object({
  source: z.union([z.literal('cafef'), z.literal('vietnamnet'), z.literal('dantri')]).optional().default('cafef'),
  limit: z.number().int().min(1).max(200).optional().default(20),
});

export default defineToolConfig({
  name: 'get-vn-coffee',
  description: 'Lấy tin liên quan tới giá cà phê / nông sản từ các báo lớn Việt Nam (CafeF, VietnamNet, DanTri).',
  zodSchema: schema,
  func: async (args) => {
    const { source, limit } = schema.parse(args);
    const url = sources[source];
    return getRssItems(url, { limit });
  },
});
