export interface Apartment {
  _id: string;
  name: string;
  pricePerMonth: number;
   depositAmount: number;
  capacity: number;
  amenities: string[];
  availableSpots: number;
  isBooked: boolean; // ✅ Add this line
}


export interface Building {
  _id: string;
  name: string;
  address: string;
  description: string;
  lat: number;
  lon: number;
  apartments: Apartment[];

  isVisible: boolean;
  ispublic: boolean;
  rules: {
    smoking: boolean;
    petsAllowed: boolean;
    noiseRestrictions: boolean;
    otherPolicies?: string;
  };
}
export interface MaintenanceTicket {
  _id: string;
  title: string;
  description: string;
  status: "open" | "in progress" | "resolved";
  picture?: {
    data: string;
    contentType: string;
  };
  studentId?: {
    first_name: string;
    last_name: string;
    email?: string;
  };
  building?: {
    name: string;
    address: string;
  };
}

