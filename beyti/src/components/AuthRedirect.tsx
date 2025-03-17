"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/utils/cookieUtils";

const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { token, role } = getCookie();

    if (token) {
      if (role === "landlord") {
        router.replace("/landlord-dashboard");
      } else if (role === "student") {
        router.replace("/student");
      } else {
        router.replace("/dashboard2");
      }
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return null;
  }

  return <>{children}</>;
};

export default AuthRedirect;
