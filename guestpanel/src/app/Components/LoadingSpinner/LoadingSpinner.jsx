"use client"

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl p-6 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="loading loading-spinner loading-md text-primary"></div>
          <span className="text-gray-700 font-medium">Loading...</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
