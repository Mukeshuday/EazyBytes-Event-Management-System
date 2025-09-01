"use client";

export default function BookingSkeleton() {
  return (
    <div className="p-4 border rounded-lg shadow-sm animate-pulse" aria-hidden="true">
      <div className="h-5 w-2/3 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
      <div className="h-3 w-1/2 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-24 bg-gray-300 rounded mt-3"></div>
      <div className="h-8 w-32 bg-gray-400 rounded mt-4"></div>
    </div>
  );
}
