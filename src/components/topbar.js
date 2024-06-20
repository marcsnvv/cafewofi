"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, User, Bell, Heart } from "../modules/icons"
import Login from "../modules/popup/login"
import Loading from "./loading"
import UserCard from "./user-card"

export default function Topbar({ avatar, ...props }) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    function searchCW(event) {
        setLoading(true)
        event.preventDefault()

        if (props.place === undefined || props.place === " ") {
            return
        } else {
            console.log(props.place)
            let q = props.place.toLowerCase().split(" ")
            router.push(`/search/${q.join("/")}`)
        }
    }

    return (
        <nav className="z-50 fixed bg-white w-full p-4 lg:px-8 shadow-sm">
            <div className="flex flex-row justify-between">
                <div className="flex justify-between lg:gap-8 gap-4 lg:w-1/3">
                    <Link href="/" className="flex gap-2 items-center">
                        <Image src="/cwf.png" width={50} height={50} alt="CWF Logo" />
                        {/* <span className="hidden lg:block text-xl font-extrabold text-darkgray">CoffeeWorkFinder</span> */}
                    </Link>
                    {props.noSearch === undefined ? <div className="relative flex flex-row items-center lg:w-full">
                        <input
                            placeholder="New York"
                            className="w-full text-darkgray font-medium bg-brand/30 rounded-md p-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-opacity-50"
                            value={props.place}
                            onChange={(e) => props.setPlace(e.target.value)}
                        />
                        <button
                            disabled={loading}
                            onClick={(e) => searchCW(e)}
                            className="absolute right-2 bg-brand text-white rounded-full p-1.5"
                        >
                            {loading ? <Loading size={16} /> : <Search color="white" size={16} />}
                        </button>
                    </div> : null}
                </div>

                <UserCard avatar={avatar} />
            </div>
        </nav>
    )
}