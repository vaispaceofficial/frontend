import React, { useState } from 'react';

const ImageZoom = ({ src, alt }) => {
  const [zoomStyle, setZoomStyle] = useState({ opacity: 0 });

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      opacity: 1,
      backgroundPosition: `${x}% ${y}%`,
      backgroundImage: `url(${src})`,
      backgroundSize: '250%',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ opacity: 0 });
  };

  return (
    <div className="relative flex">
      {/* Main Product Image Container */}
      <div
        className="relative w-full max-w-md h-[400px] border rounded-lg cursor-crosshair overflow-hidden bg-white"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Floating Enlarged Preview Box */}
      <div
        className="absolute left-[105%] top-0 w-[450px] h-[450px] border rounded-lg bg-no-repeat shadow-xl pointer-events-none transition-opacity duration-150 z-50 bg-white"
        style={zoomStyle}
      />
    </div>
  );
};

export default ImageZoom;