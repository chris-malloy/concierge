import { auth } from "@clerk/nextjs/server";
import { redirect } from 'next/navigation';
import Image from "next/image";

export default function Home() {
  const { userId } = auth();

  if (userId) {
    // If the user is logged in, redirect them to the dashboard
    redirect('/dashboard');
  }

  // If the user is not logged in, render the default landing page content
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Welcome! Please{" "}
            <a href="/sign-in" className="underline">Sign In</a>
            {" "}to continue.
          </li>
        </ol>
      </main>
    </div>
  );
}
