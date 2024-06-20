"use client"

import { useState } from "react"

import Image from "next/image"

function cn(...classes) {
    return classes.filter(Boolean).join('  ');
}

export default function BlurImage({
    className,
    url,
    width,
    height,
    alt
}) {
    const [isLoading, setLoading] = useState(true)
    const [imageError, setImageError] = useState(null)

    return (
        <>
            <Image
                onError={() => setImageError(true)}
                alt={alt}
                width={width}
                height={height}
                src={url}
                className={cn(
                    `${className && className} group-hover:opacity-75 duration-500 ease-in-out`,
                    isLoading ? 'grayscale blur-2xl scale-110' : 'grayscale-0 blur-0 scale-100'
                ) + " w-full h-full object-cover"}
                onLoad={() => setLoading(false)}
            />
        </>
    )
}