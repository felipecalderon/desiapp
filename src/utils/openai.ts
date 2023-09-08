import { configs } from '@/config/constants';
import OpenAI from 'openai'

export const openai = new OpenAI({
    organization: 'org-neN2N85ruGAGBEWDtBIfepRK',
    apiKey: configs.openaiApiKey as string,
  });
  