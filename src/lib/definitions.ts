
export type RecommendedMedicine = {
  name: string;
  price: number;
  url: string;
};

export type RelatedVideo = {
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
};

export type Weather = {
  location: string;
  temperature: string;
  condition: string;
};

export type Prediction = {
  cropType: string;
  condition: string;
  confidence: number;
  imageUrl: string;
  timestamp: number;
  recommendation: string;
  recommendedMedicines: RecommendedMedicine[];
  relatedVideos: RelatedVideo[];
  weather: Weather;
  userId?: string;
  newPrediction?: boolean;
};

export type HistoryItem = Pick<Prediction, 'cropType' | 'condition' | 'confidence' | 'imageUrl' | 'timestamp' | 'userId'> & {
  id: string;
};
