export default function Label({ children, variant }) {
    return (
        <div className={`
        ${variant.includes("rounded") ? "w-[45px] h-[45px] rounded-full" : "rounded-lg max-w-[205px]"}
        ${variant.includes("green") && "bg-green-500/25 text-green-500"}
        ${variant.includes("orange") && "bg-orange-500/25 text-orange-500"}
        ${variant.includes("red") && "bg-red-500/25 text-red-500"}
        ${variant.includes("info") && "bg-gray/25 text-darkgray"}
        flex items-center justify-center gap-4 p-2
        `}>
            {children}
        </div>
    )
}