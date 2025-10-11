import { config } from 'dotenv';
config();

import '@/ai/flows/recommend-treatment-for-crop.ts';
import '@/ai/flows/identify-pest-disease-from-image.ts';