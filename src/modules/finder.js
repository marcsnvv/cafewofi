"use client"
import { useState, useEffect } from "react"

import Filters from "./filters"
import Maps from "./map"
import Topbar from "../components/topbar"

export default function Finder({ props, params, cafes }) {
    const [place, setPlace] = useState(undefined)
    const [placeData, setPlaceData] = useState(undefined)

    useEffect(() => {
        let q = params.slug.join(" ")
        params.slug && setPlace(q.charAt(0).toUpperCase() + q.slice(1))
    }, [])

    return (
        <main className="w-full z-10">
            <Topbar avatar_url={props.avatar_url} name={props.name} setPlace={setPlace} place={place} />
            <section className="grid lg:flex gap-10 justify-between">
                <Filters
                    cafes={cafes}
                    props={{ place, likes: props.likes }}
                    setPlaceData={setPlaceData}
                />
                {/* <Maps data={placeData} cafes={cafes} /> */}
            </section>
        </main>
    )
}