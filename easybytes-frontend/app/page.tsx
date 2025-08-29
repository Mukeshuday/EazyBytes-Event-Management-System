"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
      <h1 className="text-4xl font-bold mb-4">
        🎉 Welcome to <span className="text-yellow-500">EasyBytes</span>
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        Your one-stop solution for discovering events and booking tickets with ease.
      </p>

      <div className="flex gap-4">
        <Link
          href="/events"
          className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Browse Events
        </Link>
        <Link
          href="/auth/signup"
          className="bg-yellow-500 text-gray-900 px-5 py-2 rounded-lg shadow hover:bg-yellow-600 transition"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
