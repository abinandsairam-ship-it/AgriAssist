
'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/translate-prediction-results.ts';
import '@/ai/flows/get-doctors-opinion.ts';
