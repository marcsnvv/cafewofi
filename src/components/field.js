
import { Search } from "../modules/icons"
import Loading from "./loading"

export default function Field({
    className,
    children,
    id,
    variant,
    type = "text",
    onChange,
    onClick,
    loading,
    setLoading,
    error,
    noSearch
}) {
    if (variant === "primary") {
        return (
            <div className="relative flex flex-row items-center">
                <input
                    id={id}
                    disabled={loading}
                    placeholder={children}
                    type={type}
                    className={`
                    ${className}
                    w-full text-darkgray bg-lightbrand rounded-lg p-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand
                    `}
                    onChange={(e) => onChange(e.target.value)}
                />
                {!noSearch && <button
                    disabled={loading}
                    onClick={() => onClick()}
                    className="absolute right-2 bg-brand text-white rounded-full p-1.5"
                >
                    {loading ? <Loading size={16} /> : <Search color="white" size={16} />}
                </button>}
            </div>
        )
    } else {
        return (
            <div className="relative flex flex-row items-center">
                <input
                    disabled={loading}
                    placeholder={children}
                    type={type}
                    className={`
                    ${className}
                    w-full  border-2 rounded-lg p-2 px-4 focus:outline-none
                    ${error ? "border-red-500 bg-red-200 placeholder-red-500" : "border-gray text-darkgray focus:border-darkgray"}
                    `}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>
        )
    }
}