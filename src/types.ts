export interface Resolution {
  id: string;
  text: string;
  completed: boolean;
  category?: 'health' | 'career' | 'fun' | 'learning' | 'other';
}

export interface Sticker {
  id: string;
  emoji: string;
  x: number;
  y: number;
  rotation: number;
}