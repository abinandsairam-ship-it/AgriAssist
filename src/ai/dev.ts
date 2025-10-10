'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/recommend-treatment-flow.ts';
import '@/ai/flows/identify-pest-disease-flow.ts';
