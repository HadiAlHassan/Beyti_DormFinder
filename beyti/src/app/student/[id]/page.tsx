//TEST PAGE !!!

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCookie } from "@/utils/cookieUtils"; // ✅ Get studentId from cookies

const StudentProfile = () => {
  const router = useRouter();
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    const { userId, token } = getCookie(); // ✅ Get studentId from cookies

    if (!token || !userId) {
      router.push("/login"); // ✅ Redirect if not logged in
      return;
    }

    setStudentId(userId); // ✅ Use student ID from cookies
  }, []);

  if (!studentId) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Student ID: {studentId}</h1>
    </div>
  );
};

export default StudentProfile;
