import React, { ImgHTMLAttributes, useState } from 'react';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Optimized Image component with lazy loading and SEO-friendly alt text
 * Automatically handles loading states and provides better SEO
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse rounded" />
      )}
      {hasError ? (
        <div className="absolute inset-0 bg-slate-100 flex items-center justify-center text-slate-400">
          <span>Image unavailable</span>
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          loading="lazy"
          decoding="async"
          width={width}
          height={height}
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
          {...props}
        />
      )}
    </div>
  );
};
