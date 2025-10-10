
'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/translate-prediction-results';
import '@/ai/flows/recommend-crop-flow';
