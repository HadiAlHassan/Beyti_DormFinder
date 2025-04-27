"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/utils/cookieUtils";

const ProtectedLayout = ({
  children,
  allowedRole,
  redirectTo = "/",
}: {
  children: React.ReactNode;
  allowedRole: "landlord" | "student";
  redirectTo?: string;
}) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const { token, role } = getCookie();

    if (!token || role !== allowedRole) {
      router.replace(redirectTo);
    } else {
      setIsAuthorized(true);
    }

    setLoading(false);
  }, []);

  if (loading) return null;
  if (!isAuthorized) return null;

  return <>{children}</>;
};

export default ProtectedLayout;
