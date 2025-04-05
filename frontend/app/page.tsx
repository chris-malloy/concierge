import { auth } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import Link from "next/link";
export default async function Home() {
  const { userId } = await auth();

  if (userId) {
    // If the user is logged in, redirect them to the dashboard
    redirect('/dashboard');
  }

  // If the user is not logged in, render a simple welcome message
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-4">Welcome to Concierge</h1>
      <p className="text-lg">
        Please{" "}
        <Link href="/sign-in" className="text-blue-600 underline hover:text-blue-800">
          Sign In
        </Link>
        {" "}to continue.
      </p>
    </div>
  );
}
