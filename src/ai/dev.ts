
'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/translate-prediction-results';
import '@/ai/flows/recommend-crop-flow';
import '@/ai/flows/identify-pest-disease-flow';
import '@/ai/flows/recommend-treatment-flow';
