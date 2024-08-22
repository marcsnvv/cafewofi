"use client"

import { useState, useEffect } from "react"
import { Heart, Star, Location } from "../modules/icons"
import { LikeAction } from "@/app/actions/like"
import Link from "next/link"
import Image from "next/image"

// Función para parsear el precio
function parsePrice(price) {
    if (price === "Barato" || price === "Inexpensive") {
        return "5-10€"
    } else if (price === "Moderadamente caro" || price === "Moderately expensive") {
        return "10-20€"
    } else return "--€"
}

// Placeholder para el componente de imagen
function ImagePlaceholder() {
    return (
        <div className="bg-gray-300 rounded-lg animate-pulse w-[250px] h-[250px]"></div>
    )
}

// Placeholder para el componente grande
function LargePlaceholder() {
    return (
        <div className="flex flex-col lg:flex-row gap-10 shadow-lg rounded-xl p-5 animate-pulse">
            <div className="bg-gray-300 rounded-xl lg:w-[200px] h-[200px]"></div>
            <div className="flex flex-col justify-between gap-5 lg:gap-3 w-full">
                <div className="bg-gray-300 h-6 rounded w-3/4"></div>
                <div className="flex items-center gap-2">
                    <div className="bg-gray-300 h-4 rounded w-1/2"></div>
                </div>
                <div>
                    <div className="bg-gray-300 h-4 rounded w-full"></div>
                </div>
                <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                        <div className="bg-gray-300 h-4 rounded w-10"></div>
                        <div className="flex gap-1">
                            {[...Array(5)].map((_, index) => (
                                <div key={index} className="bg-gray-300 h-4 w-4 rounded"></div>
                            ))}
                        </div>
                        <div className="bg-gray-300 h-4 rounded w-12"></div>
                    </div>
                    <div className="flex gap-2 flex-col lg:flex-row items-center">
                        <div className="bg-gray-300 h-6 rounded w-20"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function CoffeeCard({ size, data, props }) {
    const [liked, setLiked] = useState(false)
    const [loading, setLoading] = useState(true)
    const [imgError, setImgError] = useState(false) // Estado para manejar errores de imagen
    const [imageUrl, setImageUrl] = useState(null)
    const [imageWidth, setImageWidth] = useState(1080)
    const [imageHeight, setImageHeight] = useState(1080)

    useEffect(() => {
        // Set del image url y las dimensiones
        setImageUrl(data?.photos[0])

        // Verifica si data.cafe_id está en props.likes
        if (props.likes.some(like => like.cafe_id === data.cafe_id)) {
            setLiked(true)
        } else {
            setLiked(false)
        }
        setLoading(false)
    }, [data.cafe_id, props.likes])

    const handleImageError = () => {
        setImgError(true); // Maneja el error de la imagen
    }

    if (loading) {
        if (size === "xs") {
            return <ImagePlaceholder />
        } else if (size === "large") {
            return <LargePlaceholder />
        }
    }

    if (size === "xs") {
        return (
            <Link href={`/cafe/${data.slug_url}`} className="relative flex">
                <Image
                    src={imgError ? "/fallback-image.png" : imageUrl}
                    width={imageWidth}
                    height={imageHeight}
                    className="rounded-lg hover:shadow-xl cursor-pointer w-full"
                    alt={data.name}
                    onError={() => setImgError(true)}
                />
                {/* <img
                    src={imgError ? "/fallback-image.png" : `https:${data.photos[0].authorAttributions.photoUri}`} // Usa una imagen de fallback si ocurre un error
                    onError={handleImageError} // Maneja el error de carga
                    className="rounded-lg hover:shadow-xl cursor-pointer w-full"
                    alt={data.name}
                /> */}
                <form className="z-10 absolute" action={LikeAction}>
                    <input name="postId" className="hidden" value={data.cafe_id}></input>
                    <button
                        type="submit"
                        className={`rounded-full hover:bg-white p-2 m-2 bg-lightgray`}
                        onClick={() => setLiked(!liked)}
                    >
                        <Heart color={liked ? "red" : "#6B6F7B"} />
                    </button>
                </form>

                <div className="absolute z-10 bottom-0 p-2 flex items-center justify-between w-full rounded-lg bg-gradient-to-t from-black to-transparent">
                    <span className="text-lightgray font-semibold">{data.name}</span>
                    <span className="flex items-center gap-2 text-lightgray">
                        <Star opacity="1" />
                        {data.score}
                    </span>
                </div>
            </Link>
        )
    } else if (size === "large") {
        return (
            <div
                onClick={() => {
                    props.setPlaceData({
                        lat: data.lng,
                        lng: data.lat
                    })
                }}
                className={`
                cursor-pointer
                border-2 
                ${props.selectedPlace ? "border-2 border-gray" : "border-transparent"} 
                flex flex-col lg:flex-row gap-10 shadow-lg rounded-xl hover:shadow-2xl duration-150 
                ${props.structure === 1 ? "p-2 items-center justify-center" : "p-5"}`}
            >
                <img
                    src={imgError ? "/fallback-image.png" : data.main_image_url} // Usa una imagen de fallback si ocurre un error
                    onError={handleImageError} // Maneja el error de carga
                    className="rounded-xl lg:w-[200px]"
                    alt={data.name}
                />
                <div className={`flex flex-col justify-between gap-5 lg:gap-3 w-full`}>
                    <h3 className="text-xl font-bold">{data.name}</h3>
                    <span className="flex items-center gap-2">
                        <Location />
                        {data.address}
                    </span>
                    <div>
                        <span className="text-gray">{data.description}</span>
                        {data.pluses?.keywords.map((plus, index) => (
                            <span key={index} className="text-gray">{plus} · </span>
                        ))}
                    </div>
                    <div className="flex justify-between">
                        <div className="flex gap-2 items-center">
                            <span className="text-gray">{data.score}</span>
                            <div className="flex gap-1">
                                {data.score > 1 ? <Star opacity="1" /> : <Star />}
                                {data.score > 2 ? <Star opacity="1" /> : <Star />}
                                {data.score > 3 ? <Star opacity="1" /> : <Star />}
                                {data.score > 4 ? <Star opacity="1" /> : <Star />}
                                {data.score > 5 ? <Star opacity="1" /> : <Star />}
                            </div>
                            <span className="text-gray text-sm">({data.ratings})</span>
                        </div>

                        <div className="flex gap-2 flex-col lg:flex-row items-center">
                            <span className="text-xl text-darkgray font-bold">{parsePrice(data.price)}</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
