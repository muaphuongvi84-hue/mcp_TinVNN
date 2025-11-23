import { z } from 'zod';
import { defineToolConfig, getRssItems } from '../utils';

const sources = {
  cafef: 'https://cafef.vn/rss/kinh-doanh.rss',
  vneconomy: 'https://vneconomy.vn/rss/home.rss',
  vnexpress: 'https://vnexpress.net/rss/kinh-doanh.rss',
};

const schema = z.object({
  source: z.union([z.literal('cafef'), z.literal('vneconomy'), z.literal('vnexpress')]).optional().default('cafef'),
  limit: z.number().int().min(1).max(200).optional().default(40),
});

export default defineToolConfig({
  name: 'get-vn-economy',
  description: 'Lấy tin kinh tế/kinh doanh từ CafeF, VnEconomy, VnExpress.',
  zodSchema: schema,
  func: async (args) => {
    const { source, limit } = schema.parse(args);
    const url = sources[source];
    return getRssItems(url, { limit });
  },
});
