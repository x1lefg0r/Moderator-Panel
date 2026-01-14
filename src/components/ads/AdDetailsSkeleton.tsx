export const AdDetailsSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded shadow animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="h-8 bg-gray-200 rounded w-2/3"></div>
        <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
      </div>

      <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>

      <div className="mb-6">
        <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-11/12"></div>
          <div className="h-4 bg-gray-200 rounded w-10/12"></div>
          <div className="h-4 bg-gray-200 rounded w-9/12"></div>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="h-5 bg-gray-200 rounded w-40 mb-3"></div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="contents">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-4 bg-gray-200 rounded w-28"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const ImageGallerySkeleton = () => {
  return (
    <div className="bg-gray-200 rounded-lg aspect-video animate-pulse"></div>
  );
};

export const SellerCardSkeleton = () => {
  return (
    <div className="bg-white p-6 rounded shadow border animate-pulse">
      <div className="h-5 bg-gray-200 rounded w-32 mb-4"></div>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-40"></div>
        </div>
      </div>
      <div className="flex justify-between border-t pt-2">
        <div className="h-3 bg-gray-200 rounded w-20"></div>
        <div className="h-3 bg-gray-200 rounded w-24"></div>
      </div>
    </div>
  );
};
