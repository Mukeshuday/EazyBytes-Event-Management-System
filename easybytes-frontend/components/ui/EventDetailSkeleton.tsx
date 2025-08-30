export default function EventDetailSkeleton() {
  return (
    <div className="p-6 animate-pulse">
      <div className="max-w-2xl border rounded-lg shadow-sm bg-white p-6 space-y-4">
        {/* Title placeholder */}
        <div className="h-8 w-2/3 bg-gray-300 rounded"></div>

        {/* Description placeholder */}
        <div className="h-4 w-full bg-gray-200 rounded"></div>
        <div className="h-4 w-5/6 bg-gray-200 rounded"></div>
        <div className="h-4 w-4/6 bg-gray-200 rounded"></div>

        {/* Date & Price placeholders */}
        <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
        <div className="h-5 w-20 bg-gray-400 rounded mt-2"></div>

        {/* Button placeholder */}
        <div className="h-10 w-32 bg-blue-300 rounded mt-4"></div>
      </div>
    </div>
  );
}
