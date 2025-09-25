import { config } from 'dotenv';
config();

import '@/ai/flows/translate-prediction-results.ts';
import '@/ai/flows/get-doctors-opinion.ts';
import '@/ai/flows/diagnose-plant-flow.ts';
import '@/ai/flows/store-crop-data-in-firestore.ts';
