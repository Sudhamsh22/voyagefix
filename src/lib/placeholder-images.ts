import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  name?: string;
  description: string;
  imageUrl: string;
  imageHint: string;
  country?: string;
  price?: number;
  rating?: number;
  tag?: string;
  popularPlaces?: string[];
  glowColor?: string;
  type?: 'generic';
};

export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages;
