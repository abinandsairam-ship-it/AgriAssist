export type Prediction = {
  cropType: string;
  condition: string;
  confidence: number;
  imageUrl: string;
  timestamp: number;
};

export type HistoryItem = Prediction & {
  id: string;
  userId?: string;
};
