"use client"
import { useRouter } from 'next/navigation';

export default function PageWrapper() {
  const router = useRouter();
  return (
    <main className="relative min-h-screen bg-cover bg-center">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-screen text-center px-6">
        <h1 className="text-5xl font-bold text-white">
          Find Your Perfect Dorm At LAU
        </h1>
        <p className="text-lg text-gray-200 mt-4">
          Affordable, Convenient, and Tailored for Students Like You!
        </p>

      </div>
    </main>
  );
}