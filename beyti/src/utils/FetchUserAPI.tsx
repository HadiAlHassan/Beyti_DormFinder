import { getCookie } from "./cookieUtils";

export interface UserProfile {
  // Basic Info
  _id: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  nationality: string;
  home_address: string;
  dob: string; // Date as ISO string
  gender: string;

  // Contact & University
  phone_number: number;
  emergency_contact?: string;
  lau_email: string;
  lau_id: number;
  uni_start_data: string;
  uni_end_data: string;
  major?: string;

  // Documents (optional if returned)
  picture?: { data: string; contentType: string };
  passport?: { data: string; contentType: string };

  // Preferences & Lifestyle
  bio?: string;
  hobbies?: string[];
  interests?: string[];
  smoking?: boolean;
  drinking?: boolean;
  pets?: string[];
  allergies?: string[];
  sleep_schedule?: "Early Bird" | "Night Owl" | "Flexible";
  cleanliness_level?:
    | "Highly Organized"
    | "Reasonably Tidy"
    | "Casually Clean"
    | "Laid Back"
    | "Open to Discussion";
  noise_tolerance?: "Low" | "Medium" | "High";
  guests_frequency?: "Rarely" | "Occasionally" | "Frequently" | "Flexible";

  // Social
  instagram_handle?: string;
  facebook_link?: string;
  twitter_handle?: string;
  whatsApp_handle?: string;

  // Flags
  isCustomized?: boolean;

  // Optionally: timestamps
  createdAt?: string;
  updatedAt?: string;
}
  
  export async function getProfile(): Promise<UserProfile> {
    const { token } = getCookie();
    console.log("Token used for fetch:", token);
  
    const res = await fetch("http://localhost:5000/api/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    console.log("Response status:", res.status);
  
    if (!res.ok) {
      const errorData = await res.json();
      console.error("Fetch profile failed:", errorData.message);
      throw new Error(`Failed to fetch profile. Status: ${res.status}. Message: ${errorData.message}`);
    }
  
    const data = await res.json();
    console.log("Profile fetched:", data);
    return data as UserProfile;
  }
  
  
  