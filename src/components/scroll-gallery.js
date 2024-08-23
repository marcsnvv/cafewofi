import React, { useState, useRef, useEffect } from "react";
import Image from "next/image"
import { ArrowLeft, ArrowRight } from "@/modules/icons";

const ScrollGallery = ({ photos }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const galleryRef = useRef(null);

    const handleScroll = (e) => {
        const scrollLeft = e.target.scrollLeft;
        const width = e.target.clientWidth;
        const newIndex = Math.round(scrollLeft / width);
        setCurrentIndex(newIndex);
    };

    const scrollToIndex = (index) => {
        if (galleryRef.current) {
            galleryRef.current.scrollTo({
                left: index * galleryRef.current.clientWidth,
                behavior: "smooth",
            });
            setCurrentIndex(index);
        }
    };

    const toggleExpand = (e) => {
        e.preventDefault();
        setIsExpanded(!isExpanded);
    };

    const handlePrevClick = () => {
        if (currentIndex > 0) {
            scrollToIndex(currentIndex - 1);
        }
    };

    const handleNextClick = () => {
        if (currentIndex < photos.length - 1) {
            scrollToIndex(currentIndex + 1);
        }
    };

    return (
        <div className="relative w-full">
            {/* Contenedor de la galería de imágenes */}
            <div
                ref={galleryRef}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide cursor-grab"
                onScroll={handleScroll}
            >
                {photos?.map((photo, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 snap-center w-full h-[500px] relative"
                        onClick={(e) => {
                            toggleExpand(e);
                        }}
                    >
                        <Image
                            src={photo}
                            layout="fill"
                            objectFit="cover"
                            alt={`Image ${index}`}
                            className="rounded-lg cursor-pointer"
                        />
                    </div>
                ))}
            </div>

            {/* Flechas de navegación */}
            <button
                className="hidden lg:flex absolute left-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white/50 text-white rounded-full"
                onClick={handlePrevClick}
            >
                <ArrowLeft color="#fff" />
            </button>
            <button
                className="hidden lg:flex absolute right-4 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white/50 text-white rounded-full"
                onClick={handleNextClick}
            >
                <ArrowRight color="#fff" />
            </button>

            {/* Indicadores de la imagen actual */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {photos?.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => scrollToIndex(index)}
                        className={`h-2 w-2 rounded-full ${currentIndex === index ? "bg-white" : "bg-white/50"
                            }`}
                    />
                ))}
            </div>

            {/* Modal de expansión de la imagen */}
            {isExpanded && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    {/* Botón de cierre */}
                    <button
                        onClick={toggleExpand}
                        className="absolute top-4 right-4 text-white text-3xl z-50"
                    >
                        &times;
                    </button>
                    <div className="relative w-full max-w-4xl h-full max-h-screen p-4">
                        <Image
                            src={photos[currentIndex]}
                            layout="fill"
                            objectFit="contain" // Asegura que las imágenes verticales no se corten
                            alt={`Image ${currentIndex}`}
                            className="rounded-lg"
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScrollGallery;
