import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorDisplay = ({ error, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
    <div className="flex items-center">
      <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
      <span className="text-red-700">{error}</span>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="ml-auto px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
        >
          Retry
        </button>
      )}
    </div>
  </div>
);
export default ErrorDisplay;