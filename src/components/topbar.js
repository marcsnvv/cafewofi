"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, User, Bell, Heart } from "../modules/icons"
import Login from "../modules/popup/login"
import Loading from "./loading"
import UserCard from "./user-card"
import UserAutocomplete from "./user-autocomplete"

export default function Topbar({ avatar, ...props }) {
    const router = useRouter()
    const [query, setQuery] = useState(null)
    const [loading, setLoading] = useState(false)

    function searchCW() {
        setLoading(true)

        if (query === undefined || query.trim() === "") {
            setLoading(false)
            return
        } else {
            let q = query.toLowerCase().split(" ")
            router.push(`/search/${q.join("/")}`)
        }
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            searchCW()
        }
    }

    return (
        <nav className="z-50 fixed bg-white w-full p-4 lg:px-8 shadow-sm flex items-center justify-between">
            <div className="flex justify-between w-full">
                <div className="flex justify-between lg:gap-8 gap-4 w-auto">
                    <Link href="/" className="flex gap-2 items-center">
                        <Image src="/cwf.png" width={50} height={50} alt="CWF Logo" />
                        {/* <span className="hidden lg:block text-xl font-extrabold text-darkgray">CoffeeWorkFinder</span> */}
                    </Link>
                    {props.noSearch === undefined ? <div className="relative flex flex-row items-center">
                        <input
                            placeholder={props.placeholder ? props.placeholder : "New York"}
                            className="text-darkgray font-medium bg-lightbrand rounded-md p-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-opacity-50 w-full"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyPress={handleKeyPress}
                        />
                        <button
                            disabled={loading}
                            onClick={(e) => searchCW(e)}
                            className="absolute right-2 bg-brand text-white rounded-full p-1.5"
                        >
                            {loading ? <Loading size={16} /> : <Search color="white" size={16} />}
                        </button>
                    </div> : null}
                    {props.uAuto && <div className="relative flex flex-row items-center">
                        <UserAutocomplete username={props.username} />
                    </div>
                    }
                </div>

                <UserCard avatar={avatar} />
            </div>
        </nav>
    )
}