
export interface FeedbackEntry {
  id: string;
  mood: number;
  comment: string;
  timestamp: number;
}

export interface ActionPlan {
  themes: string[];
  points: string[];
}
