"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/utils/cookieUtils"; // ✅ Get studentId from cookies
import { LandLordDashBoard } from "@/components/LandLordDashboad/LandLordDashBoard";


const LandlordProfile = () => {
  const router = useRouter();
  const [LandlordId, setLandlordId] = useState<string | null>(null);

  useEffect(() => {
    const { userId, token } = getCookie(); // ✅ Get Id from cookies
    
    if (!token || !userId) {
      router.push("/login"); // ✅ Redirect if not logged in
      return;
    }

    setLandlordId(userId); // ✅ Use ID from cookies
  }, []);

  if (!LandlordId) return <div>Loading...</div>;

  return (
    <>
      <LandLordDashBoard />

    </>
  );
};

export default LandlordProfile;
