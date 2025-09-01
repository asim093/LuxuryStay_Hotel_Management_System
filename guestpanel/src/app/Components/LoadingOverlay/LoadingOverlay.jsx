"use client"
import { useAuth } from '../../context/AuthContext';
import { useClientSide } from '../../hooks/useClientSide';

const LoadingOverlay = () => {
  const { loading, loadingMessage, loadingProgress } = useAuth();
  const isClient = useClientSide();

  if (!isClient || !loading) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full mx-4">
        <div className="text-center space-y-4">
          {/* Loading Spinner */}
          <div className="loading loading-spinner loading-lg text-primary"></div>
          
          {/* Loading Message */}
          <h3 className="text-lg font-semibold text-gray-800">
            {loadingMessage}
          </h3>
          
          {/* Progress Bar */}
          {loadingProgress > 0 && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
          )}
          
          {/* Progress Percentage */}
          {loadingProgress > 0 && (
            <p className="text-sm text-gray-600">
              {loadingProgress}% Complete
            </p>
          )}
          
          {/* Loading Animation */}
          <div className="flex justify-center space-x-1">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
