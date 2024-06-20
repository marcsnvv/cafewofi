"use client"
// import { useState } from "react"
import Loading from "./loading"

export default function Button({
    children,
    className,
    variant = "primary",
    onClick,
    loading = false,
    disabled
}) {
    // const [isHovered, setIsHovered] = useState(false)

    return (
        <button className={`
        ${variant.includes("primary")
                ? "bg-brand text-white hover:bg-lightbrand hover:text-brand"
                : "border-gray border-2 text-gray hover:bg-gray/25"}
        flex items-center justify-center gap-4 p-2
        rounded-lg focus:outline-none
        ${className}
        `}
            onClick={onClick ? (e) => onClick(e) : null}
            disabled={loading || disabled}
        >
            {loading ? <Loading color="brand" /> : children}
        </button>
    )
}