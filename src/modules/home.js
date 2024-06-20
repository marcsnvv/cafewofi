"use client"

import { useState } from "react"

import Link from "next/link"
import Image from "next/image"
import { useRouter } from 'next/navigation'

import { Search, User, Bell } from "@/modules/icons"
import Login from "@/modules/popup/login"
import Loading from "../components/loading"
import Field from "@/components/field"
import UserCard from "@/components/user-card"
import Modal from "@/components/modal"
import Button from "@/components/button"

import Typewriter from 'typewriter-effect'

const workplaces = [
    "Barcelona",
    "New York",
    "Cerdegna",
    "Bali",
    "Chiang Mai",
    "Medellín",
    "Lisboa",
    "Tbilisi",
    "Praga",
    "Ho Chi Minh City",
    "Canggu",
    "Budapest",
    "Ciudad de México",
    "Bucarest",
    "Playa del Carmen",
    "Tallin",
    "Ubud",
    "Kiev",
    "Bangkok",
    "Lima",
    "Las Palmas",
    "Sofía"
]

export default function HomePage({ name, avatar }) {
    const router = useRouter()
    const [query, setQuery] = useState()
    const [loading, setLoading] = useState(false)

    function searchCW() {
        setLoading(true)

        if (query === undefined || query === " ") {
            return
        } else {
            console.log(query)
            let q = query.toLowerCase().split(" ")
            router.push(`/search/${q.join("/")}`)
        }
    }

    return (
        <div
            className="bg-no-repeat bg-center bg-cover p-5"
            style={{
                backgroundImage: "url('/bg.png')",
                height: '100vh'
            }}
        >
            <nav className="p-5 items-center justify-between">
                <Link href={"/"}>
                    <Image src={"/cwf.png"} width={50} height={50} />
                </Link>
                <UserCard avatar={avatar} />
            </nav>

            <div>
                <h1 className="text-center font-bold text-9xl">
                    Find your workplace in
                </h1>
                <div className="relative flex flex-row items-center lg:w-full">
                    <input
                        placeholder="New York"
                        className="w-full text-darkgray font-medium bg-brand/30 rounded-md p-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-opacity-50"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button
                        disabled={loading}
                        onClick={(e) => searchCW(e)}
                        className="absolute right-2 bg-brand text-white rounded-full p-1.5"
                    >
                        {loading ? <Loading size={16} /> : <Search color="white" size={16} />}
                    </button>
                </div>
            </div>

            <span>
                Terms & Conditions
            </span>

        </div>
    )
}
