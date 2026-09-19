export type DestinationRegion = "domestic" | "international";

export interface DestinationItinerary {
  oneDay: string[];
  threeDay: string[];
}

export interface DestinationImage {
  url: string;
  alt: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region: DestinationRegion;
  description: string;
  bestSeason: string;
  attractions: string[];
  itinerary: DestinationItinerary;
  budget: string;
  transport: string;
  food: string[];
  etiquette: string[];
  source: string;
  updatedAt: string;
  image: DestinationImage;
}
