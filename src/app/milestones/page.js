"use client"

import { useState, useEffect } from "react"
import Topbar from '@/components/topbar'
import { createClient } from '@/utils/supabase/client'
import { Diamond } from "@/modules/icons"
import Link from "next/link"

const milestones = [
    {
        title: "Cafewofi Mug",
        description: "Get your own Cafewofi branded mug!",
        points: 5000,
        imageUrl: "/milestone-1.png"
    },
    {
        title: "Cafewofi Travel mug",
        description: "Level up with the travel mug.",
        points: 10000,
        imageUrl: "/milestone-2.png"
    },
    {
        title: "Portable Coffee Maker",
        description: "Perfect for enjoying your coffee anywhere.",
        points: 25000,
        imageUrl: "/milestone-3.png"
    },
    {
        title: "3-Month Coworking Pass",
        description: "Work from any Cafewofi partner cafe for 3 months.",
        points: 50000,
        imageUrl: "/milestone-4.png"
    }
]

export default function MilestonesPage() {
    const supabase = createClient()
    const [avatarUrl, setAvatarUrl] = useState()
    const [selectedMilestone, setSelectedMilestone] = useState(null)


    const openPopup = (milestone) => {
        setSelectedMilestone(milestone)
    }

    const closePopup = () => {
        setSelectedMilestone(null)
    }

    useEffect(() => {
        async function obtenerAvatarUrl() {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                const { data, error } = await supabase
                    .from("users")
                    .select("avatar_url")
                    .eq("id", session.user.id)
                    .single()

                if (error) {
                    console.error("Error al obtener el avatar_url:", error)
                } else if (data) {
                    setAvatarUrl(data.avatar_url)
                }
            }
        }

        obtenerAvatarUrl()
    }, [])

    return (
        <>
            <Topbar avatar_url={avatarUrl} />
            <div className="min-h-screen py-10">
                <div className="mt-20 container mx-auto px-4">
                    <div className="bg-lightgray text-gray p-4 rounded-lg mb-8 text-center">
                        <p>You can earn points by interacting with cafes, making reservations, leaving reviews, etc.
                            The more points you have, the more you will level up. Each level you go up, you will get more points for each action you take.
                            If you get any of these, post them on X tagging us <Link href={"https://x.com/cafewofi"} className="text-brand hover:underline">@cafewofi</Link>.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {milestones.map((milestone, index) => (
                            <div
                                key={index}
                                className="border border-transparent bg-lightbrand hover:border-brand p-6 rounded-lg shadow-md cursor-pointer"
                                onClick={() => openPopup(milestone)}
                            >
                                <h2 className="text-2xl font-bold font-nyght mb-2">{milestone.title}</h2>
                                <p className="text-gray mb-4">{milestone.description}</p>
                                <p className="text-brand font-nyght text-2xl flex gap-2 items-center">
                                    <Diamond color="#CC7843" />
                                    {milestone.points} Points
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {selectedMilestone && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg max-w-md flex flex-col items-center justify-start">
                        <h2 className="text-2xl font-bold font-nyght mb-2">{selectedMilestone.title}</h2>
                        <p className="text-gray mb-4">{selectedMilestone.description}</p>
                        <p className="text-brand font-nyght text-2xl mb-4 flex gap-2 items-center">
                            <Diamond color="#CC7843" />
                            {selectedMilestone.points} Points
                        </p>
                        <img
                            src={selectedMilestone.imageUrl}
                            alt={selectedMilestone.title}
                            className="w-60 rounded-md text-center"
                        />
                        <button
                            onClick={closePopup}
                            className="bg-brand text-white px-4 py-2 rounded-md hover:bg-opacity-80"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </>
    )
}
