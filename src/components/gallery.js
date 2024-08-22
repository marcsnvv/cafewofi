import React, { useState } from "react";
import Image from "next/image";

const Gallery = ({ photos, limit, cols, rows }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [imageError, setImageError] = useState(false);

    const handleImageClick = (src) => {
        setSelectedImage(src);
    };

    const handleClose = () => {
        setSelectedImage(null);
    };

    // Si hay un límite, cortamos la lista de fotos al límite especificado
    const displayedPhotos = limit ? photos.slice(0, limit) : photos;

    return (
        <>
            <div className="grid grid-cols-2 gap-4">
                {displayedPhotos?.map((photo, index) => (
                    <Image
                        key={index}
                        src={imageError ? "/fallback-image.png" : photo}
                        width={1080}
                        height={1080}
                        className="rounded-lg cursor-pointer"
                        alt={`Gallery image ${index}`}
                        onClick={() => handleImageClick(photo)}
                        onError={() => setImageError(true)}
                    />
                ))}
            </div>

            {selectedImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 h-screen"
                    onClick={handleClose}
                >
                    <div className="relative max-w-full max-h-full flex items-center justify-center">
                        <Image
                            src={selectedImage}
                            width={1080}
                            height={1080}
                            className="rounded-lg object-contain max-h-full max-w-full"
                            alt="Expanded image"
                        />
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-2 text-white bg-gray-800 rounded-full p-2"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Gallery;
