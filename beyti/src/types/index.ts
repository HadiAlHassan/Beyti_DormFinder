export interface Apartment {
    _id: string;
    name: string;
    pricePerMonth: number;
    capacity: number;
    amenities: string[];
    availableSpots: number;
  }
  
  export interface Building {
    _id: string;
    name: string;
    address: string;
    description: string;
    lat: number;
    lon: number;
    apartments: Apartment[];
  }
  