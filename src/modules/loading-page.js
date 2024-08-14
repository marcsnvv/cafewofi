import Image from "next/image"

export default function LoadingPage() {
    return (
        <div className="w-screen h-screen flex items-center justify-center">
            <Image src="/loader.gif" width={500} height={500} />
        </div>
    )
}