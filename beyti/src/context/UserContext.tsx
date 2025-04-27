// /context/UserContext.tsx

import { createContext, useContext, useEffect, useState } from "react";
import { UserProfile, getProfile } from "@/utils/FetchUserAPI"; // import both

interface UserContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        const userData = await getProfile();
        setProfile(userData);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // Optionally set profile to null or do some error handling
      }
    }

    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ profile, setProfile }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
