export default function EventSkeleton() {
  return (
    <div className="p-4 border rounded-lg shadow-sm animate-pulse bg-white">
      {/* Title */}
      <div className="h-6 w-2/3 bg-gray-300 rounded mb-3"></div>

      {/* Description */}
      <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-5/6 bg-gray-100 rounded mb-2"></div>

      {/* Date & Price */}
      <div className="h-4 w-1/3 bg-gray-300 rounded mb-2"></div>
      <div className="h-5 w-20 bg-gray-400 rounded mt-2"></div>

      {/* Button */}
      <div className="h-9 w-28 bg-blue-300 rounded mt-4"></div>
    </div>
  );
}
