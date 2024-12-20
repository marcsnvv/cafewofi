"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

import { createClient } from "@/utils/supabase/client"

import { useRouter } from 'next/navigation'
import { Search } from "@/modules/icons"
import Loading from "@/components/loading"

import UserCard from "@/components/user-card"
import Typewriter from 'typewriter-effect'
import Popup from "@/components/popup"
import Login from "@/modules/popup/login"

const workplaces = [
  "Copenhague",
  "Zagreb",
  "Vienna",
  "Dublin",
  "Amsterdam",
  "Girona",
  "Chiang Mai",
  "Valencia",
  "New York",
  "Cerdegna",
  "Barcelona",
  "Bali",
  "Medellín",
  "Madrid",
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
  "Sofía",
  "Lagos",
  "Cairo",
  "Kabul"
]

function shuffleArray(array) {
  const shuffledArray = [...array]; // Crear una copia del array original
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // Elegir un índice aleatorio
    // Intercambiar elementos
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}


export default function Home() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const [user, setUser] = useState()
  const [randomWorkPlaces, setRandomWorkPlaces] = useState()

  useEffect(() => {
    setRandomWorkPlaces(shuffleArray(workplaces))
  }, [])

  useEffect(() => {
    async function getData() {
      const supabase = createClient()

      const { data: { session } } = await supabase.auth.getSession()
      console.log(session)
      if (session) {
        const { data, error } = await supabase
          .from("users")
          .select("avatar_url, name")
          .eq("id", session.user.id)

        if (error) {
          console.error(error)
        } else {
          setUser(data[0])
        }
      }
    }

    getData()
  }, [])

  function searchCW(e) {
    e.preventDefault()
    setLoading(true)
    // if (!user) {
    //   setShowModal(true)
    // } else {
    if (query === undefined || query.trim() === "") {
      setLoading(false)
      return
    } else {
      let q = query.toLowerCase().split(" ")
      router.push(`/search/${q.join("/")}`)
    }
    // }

  }

  function handleKeyPress(event) {
    if (event.key === 'Enter') {
      searchCW(event)
    }
  }

  return (
    <div
      className="p-5 bg-no-repeat bg-center bg-cover flex flex-col justify-between items-center min-w-full"
      style={{
        backgroundImage: "url('/bg.png')",
        height: '100vh',
        width: '100vw'
      }}
    >
      <nav className="flex items-center justify-between w-full">
        <Link href={"/"}>
          <Image src={"/cwf.png"} width={50} height={50} />
        </Link>

        <UserCard user={user} />
      </nav>

      <div className="h-screen w-full flex flex-col items-center justify-center gap-10">
        <h1 className="text-center text-white text-4xl lg:text-7xl lg:leading-[85px] font-bold">
          Find your workplace<br />
          <div className="flex items-start justify-center gap-4 lg:gap-10">
            <span className="font-roboto font-bold">in{" "}</span>
            <span className="font-nyght">
              <Typewriter
                options={{
                  strings: randomWorkPlaces,
                  autoStart: true,
                  loop: true,
                }}
              />
            </span>
          </div>
        </h1>
        <div className="relative flex flex-row items-center">
          <input
            placeholder="New York"
            className="w-full text-darkgray font-medium bg-lightbrand rounded-md p-2 px-4 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-opacity-50"
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
        </div>
      </div>

      <Link href={"/discord"}>
        <span className="text-lightbrand hover:underline">
          Join our community
        </span>
      </Link>

      {showModal && (
        <Popup
          opened
          content={
            <Login />
          }
        />
      )}
    </div>
  )
}

