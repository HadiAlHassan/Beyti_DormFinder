import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-center">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <p className="text-xl text-gray-700 dark:text-gray-300 mt-4">
        Oops! The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link 
        href="/" 
        className="mt-6 px-6 py-3 bg-primary text-white rounded-lg hover:bg-secondary transition">
        Go Home
      </Link>
    </div>
  );
}
