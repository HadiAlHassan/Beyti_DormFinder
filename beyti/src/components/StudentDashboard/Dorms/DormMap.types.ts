export interface Apartment {
  _id: string;
  name: string;
  pricePerMonth: number;
  capacity: number;
  availableSpots: number;
  isBooked: boolean;
}

export interface Building {
  _id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  description: string;
  isVisible: boolean;
  ispublic: boolean;
  rules: {
    smoking: boolean;
    petsAllowed: boolean;
    noiseRestrictions: boolean;
    otherPolicies?: string;
  };
  pictures?: {
    data: { type: "Buffer"; data: number[] };
    contentType: string;
  }[];
  apartments: Apartment[];
}
