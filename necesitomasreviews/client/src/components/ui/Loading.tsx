import React from 'react';

interface LoadingProps {
  fullScreen?: boolean;
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

const Loading: React.FC<LoadingProps> = ({
  fullScreen = true,
  message = 'Loading...',
  size = 'medium'
}) => {
  // Size classes for spinner
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-12 w-12 border-b-2 border-t-2',
    large: 'h-16 w-16 border-4'
  };

  // Size classes for text
  const textClasses = {
    small: 'text-sm',
    medium: 'text-lg',
    large: 'text-xl'
  };

  // Container classes
  const containerClasses = fullScreen
    ? 'flex items-center justify-center h-screen'
    : 'flex items-center justify-center p-4';

  return (
    <div className={containerClasses}>
      <div className={`animate-spin rounded-full ${sizeClasses[size]} border-blue-500`}></div>
      {message && <span className={`ml-2 ${textClasses[size]} text-gray-800`}>{message}</span>}
    </div>
  );
};

export default Loading;