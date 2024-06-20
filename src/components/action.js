export default function Action({ children }) {
    return (
        <div className="flex items-center justify-start gap-4 p-2 px-4 rounded-lg hover:bg-gray/25 relative">
            {children}
        </div>
    )
}