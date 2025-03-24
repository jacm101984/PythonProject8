// src/components/ui/OptimizedImage.tsx
import React, { useState, useEffect } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholderColor?: string;
  lazyLoad?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  placeholderColor = '#f3f4f6',
  lazyLoad = true
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState(lazyLoad ? '' : src);

  useEffect(() => {
    // Si lazyLoad está activo, usaremos IntersectionObserver para cargar
    if (lazyLoad) {
      // Crear un elemento image para precargar
      const img = new Image();

      // Crear un observer para detectar cuando la imagen está en el viewport
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          // Cuando el placeholder está visible, comenzamos a cargar la imagen real
          img.src = src;

          // Limpiar el observer
          observer.disconnect();
        }
      });

      // Observar el elemento en el DOM
      const element = document.getElementById(`image-placeholder-${src.replace(/\W/g, '')}`);
      if (element) {
        observer.observe(element);
      }

      // Cuando la imagen se carga, la mostramos
      img.onload = () => {
        setImageSrc(src);
        setImageLoaded(true);
      };

      return () => {
        observer.disconnect();
      };
    }
  }, [src, lazyLoad]);

  // Si no es lazyload, comportamiento normal
  if (!lazyLoad) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        onLoad={() => setImageLoaded(true)}
      />
    );
  }

  // Para lazyload, mostramos primero un placeholder
  return (
    <div
      id={`image-placeholder-${src.replace(/\W/g, '')}`}
      className={`relative overflow-hidden ${className}`}
      style={{ width: width ? `${width}px` : '100%', height: height ? `${height}px` : 'auto' }}
    >
      {/* Placeholder */}
      <div
        className={`absolute inset-0 bg-gray-200 ${imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        style={{ backgroundColor: placeholderColor }}
      />

      {/* Imagen real */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
        />
      )}
    </div>
  );
};

export default OptimizedImage;