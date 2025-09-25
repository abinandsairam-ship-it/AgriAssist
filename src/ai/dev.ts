import { config } from 'dotenv';
config();

import '@/ai/flows/store-crop-data-in-firestore.ts';
import '@/ai/flows/translate-prediction-results.ts';