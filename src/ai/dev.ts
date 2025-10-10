'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/translate-prediction-results.ts';
import '@/ai/flows/recommend-crop-flow.ts';
import '@/ai  /flows/recommend-treatment-flow.ts';
import '@/ai/flows/get-doctors-opinion.ts';
