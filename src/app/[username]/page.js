"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"

import Image from "next/image"
import Topbar from "@/components/topbar"

import CoffeeCard from "@/components/cafe-card"
import Review from "@/components/review"

import ETS from "@/utils/elapsed"
import Thumbnail from "@/components/thumbnail"

import { At } from "@/modules/icons"

export default function User({ params }) {
    const supabase = createClientComponentClient()
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState()
    const [reviews, setReviews] = useState()
    const [likes, setLikes] = useState()
    const [avatar, setAvatar] = useState()

    useEffect(() => {
        async function getData() {
            const { data: { session } } = await supabase.auth.getSession()
            setAvatar(session?.user?.user_metadata?.avatar_url)
            const { data, error } = await supabase
                .from('users')
                .select(`
                    *,
                    reviews(*),
                    likes(cafe_id, cafes(*))
                `)
                .eq('username', params.username)

            if (error) {
                console.error('Error fetching data:', error)
                return
            }

            if (data[0]?.id === session.user.id) {
                window.location.href = "/account";
            }

            setProfile(data[0])
            setReviews(data[0]?.reviews)
            setLikes(data[0]?.likes.map(like => like.cafes))
            setLoading(false)
        }
        params && getData()
    }, [params])

    return (
        <main>
            <Topbar
                avatar={avatar}
                noSearch
                uAuto
                username={profile?.username}
            />
            <section>
                {/* User thumbnail */}
                <Thumbnail
                    thumbnail_url={profile?.thumbnail}
                    userId={profile?.id}
                    onlyView
                />
                <div className="-mt-14 flex h-auto m-5 px-2 bg-lightgray rounded-lg items-center">
                    <div>
                        <Image src={profile?.avatar_url} width={120} height={120} className="rounded-lg" />
                    </div>
                    <div className="p-5 flex flex-col justify-between items-start gap-1 w-full">
                        <div className="flex justify-between items-center w-full">
                            <h2 className="text-2xl font-roboto font-semibold">{profile?.name}</h2>
                            <div className="flex items-center gap-2">
                                {profile?.is_premium && (
                                    <Tooltip text="Premium">
                                        <WorkCafe />
                                    </Tooltip>
                                )}
                                {profile?.is_verified && (
                                    <Tooltip text="Verified by CWF">
                                        <Verified />
                                    </Tooltip>
                                )}
                                {profile?.is_coffeemaker && (
                                    <Tooltip text="Coffee Maker">
                                        <CoffeeMaker />
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                        <h2 className="text-lg text-gray font-roboto flex items-center justify-center gap-1">
                            <div className="mt-1">
                                <At />
                            </div>
                            {profile?.username}
                        </h2>
                        <span className="text-sm text-gray">
                            Member since {ETS(profile?.created_at)}
                        </span>
                    </div>
                </div>
            </section>

            <section className="flex lg:flex-row flex-col justify-between">
                <div className="p-5 lg:w-1/2 w-full">
                    <div className="flex flex-col gap-5">
                        <h3 className="font-semibold font-nyght text-xl">Cafes you like</h3>

                        <div className="grid grid-cols-2 gap-5">
                            {likes &&
                                likes
                                    .slice() // Hacemos una copia para no modificar el array original
                                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Ordenamos por fecha de creación de más reciente a más antiguo
                                    .map((coffee, index) => (
                                        <CoffeeCard
                                            key={index}
                                            props={{ likes }}
                                            data={coffee}
                                            size="xs"
                                        />
                                    ))}
                        </div>
                    </div>
                </div>

                <div className="p-5 mt-20 lg:w-1/2 w-auto">
                    <div className="flex flex-col gap-5">
                        <h3 className="font-semibold font-nyght text-xl">Your reviews</h3>

                        <div className="flex flex-wrap gap-5">
                            {reviews &&
                                reviews
                                    .slice() // Hacemos una copia para no modificar el array original
                                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Ordenamos por fecha de creación de más reciente a más antiguo
                                    .map((review, index) => (
                                        <Review
                                            key={index}
                                            data={review}
                                            avatar={profile?.avatar_url}
                                            name={profile?.name}
                                            username={profile?.username}
                                        />
                                    ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}