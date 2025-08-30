"use client";

export default function BookingSkeleton() {
  return (
    <div className="p-4 border rounded-lg shadow-sm animate-pulse">
      <div className="h-5 w-1/3 bg-gray-300 rounded mb-2"></div>
      <div className="h-4 w-2/3 bg-gray-200 rounded mb-2"></div>
      <div className="h-3 w-1/4 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-20 bg-gray-300 rounded mt-3"></div>
      <div className="h-8 w-28 bg-gray-400 rounded mt-4"></div>
    </div>
  );
}
