import Link from "next/link";
import { ModeToggle } from "@/components/ModeToggle";

export default function Home() {
  return (
    <>
    <ModeToggle></ModeToggle>
    <Link href="/login/owner-login">
      <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
        Go to Destination
      </button>
    </Link>
    </>
  );
}
