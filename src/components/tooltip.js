"use client"

import React, { useState } from 'react';

const Tooltip = ({ children, text }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="relative flex items-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {children}
            {isHovered && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 flex flex-col items-center">
                    <div className="z-20 bg-brand text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                        {text}
                    </div>
                    <div className="w-3 h-3 bg-brand transform rotate-45 -mt-2"></div>
                </div>
            )}
        </div>
    );
};

export default Tooltip;
