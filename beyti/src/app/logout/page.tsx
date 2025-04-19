"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    document.cookie =
      "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "userRole=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "userId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // 🧹 Clear cached dorm data (student-specific)
    sessionStorage.removeItem("hasCurrentDorm");
    sessionStorage.removeItem("cachedDormUserId");

    router.push("/");
  }, [router]);

  return null;
}
