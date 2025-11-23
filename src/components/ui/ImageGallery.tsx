import { useState } from "react";

export const ImageGallery = ({ images }: { images: string[] }) => {
  const [activeImage, setActiveImage] = useState(images[0]);

  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-200 h-64 rounded flex items-center justify-center">
        Нет фото
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="h-96 bg-gray-100 rounded-lg overflow-hidden border">
        <img
          src={activeImage}
          alt="Main image"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(img)}
            className={`w-20 h-20 flex-shrink-0 border-2 rounded overflow-hidden ${
              activeImage === img ? "border-blue-500" : "border-transparent"
            }`}
          >
            <img
              src={img}
              alt={`img-${idx}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};
