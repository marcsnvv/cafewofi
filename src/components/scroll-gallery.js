import React, { useState, useRef } from "react";
import Image from "next/image";

const ScrollGallery = ({ photos }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState(0);
    const galleryRef = useRef(null);

    // Scroll to a specific index
    const scrollToIndex = (index) => {
        if (galleryRef.current) {
            galleryRef.current.scrollTo({
                left: index * galleryRef.current.clientWidth,
                behavior: "smooth",
            });
        }
    };

    // Toggle image expansion
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    // Handle drag start
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartPos(e.clientX);
        galleryRef.current.style.cursor = "grabbing";
    };

    // Handle drag end and decide if the image should change
    const handleMouseUp = (e) => {
        setIsDragging(false);
        galleryRef.current.style.cursor = "grab";

        const endPos = e.clientX;
        const diff = startPos - endPos;

        // Swipe left
        if (diff > 50 && currentIndex < photos.length - 1) {
            setCurrentIndex(currentIndex + 1);
            scrollToIndex(currentIndex + 1);
        }
        // Swipe right
        else if (diff < -50 && currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            scrollToIndex(currentIndex - 1);
        }
    };

    return (
        <div className="relative w-full">
            {/* Gallery container */}
            <div
                ref={galleryRef}
                className="flex overflow-hidden snap-x snap-mandatory scrollbar-hide cursor-grab"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {photos?.map((photo, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 snap-center w-full h-[500px] relative"
                        onClick={toggleExpand}
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

            {/* Indicators */}
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

            {/* Expanded image modal */}
            {isExpanded && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                    {/* Close button */}
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
                            objectFit="contain"
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
