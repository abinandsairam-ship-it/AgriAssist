
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
};

export type HistoryItem = Pick<Prediction, 'cropType' | 'condition' | 'confidence' | 'imageUrl' | 'timestamp' | 'userId'> & {
  id: string;
};

export type ActivityHistoryItem = {
    id: string;
    userId: string;
    actionType: string;
    timestamp: number;
    targetId?: string;
    details?: string;
}
