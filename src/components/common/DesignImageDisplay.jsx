'use client';

import React, { useState, useEffect } from 'react';

const DesignImageDisplay = ({ imageData, imageMimeType, altText = "Design Image", className }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    if (imageData && imageMimeType) {
      let url = null;
      if (typeof imageData === 'string') {
        // If imageData is a Base64 string
        url = `data:${imageMimeType};base64,${imageData}`;
      } else if (imageData.data) {
        // If imageData is a Buffer object (serialized to { type: 'Buffer', data: [...] })
        const bufferData = new Uint8Array(imageData.data);
        const blob = new Blob([bufferData], { type: imageMimeType });
        url = URL.createObjectURL(blob);
      }
      setImageUrl(url);

      return () => {
        if (url && url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      };
    } else {
      setImageUrl(null);
    }
  }, [imageData, imageMimeType]);

  if (!imageUrl) {
    // Fallback to a default image if no valid image data
    return (
      <img
        src="/public/img/Fondos/Fondo 1.jpg"
        alt="No hay imagen disponible"
        className={className}
      />
    );
  }

  return (
    <img
      src={imageUrl}
      alt={altText}
      className={className}
    />
  );
};

export default DesignImageDisplay;
