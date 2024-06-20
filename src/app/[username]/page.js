"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"

import Image from "next/image"
import Topbar from "@/components/topbar"

import CoffeeCard from "@/components/cafe-card"
import Review from "@/components/review"

import ETS from "@/utils/elapsed"
import Thumbnail from "@/components/thumbnail"

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
                loading={loading}
                avatar={avatar}
                name={profile?.name}
                noSearch
            />
            <section>
                {/* User thumbnail */}
                <Thumbnail
                    thumbnail_url={profile?.thumbnail}
                    userId={profile?.id}
                    onlyView
                />
                <div className="flex rounded-lg z-40 absolute top-80 m-5 lg:left-5 bg-white lg:w-96 p-1 lg:m-0">
                    <Image
                        src={profile?.avatar_url}
                        width={150}
                        height={150}
                        className="rounded-lg"
                    />
                    <div className="p-5 flex flex-col justify-between items-start gap-2">
                        <h2 className="text-2xl font-roboto font-semibold">{profile?.name}</h2>
                        <h2 className="text-xl font-roboto">@{profile?.username}</h2>
                        <span className="text-brand text-xl">Nomad</span>
                        <span className="text-sm text-gray">
                            Member since {ETS(profile?.created_at)}
                        </span>
                    </div>
                </div>
            </section>

            <main className="flex lg:flex-row flex-col justify-between">

                <section className="p-5 mt-40 lg:w-1/2 w-full">
                    <div className="flex flex-col gap-5">
                        <h3 className="font-semibold font-nyght text-xl">Cafes you like</h3>

                        <div className="grid grid-cols-2 gap-5">
                            {likes && likes.map(coffee => (
                                <CoffeeCard
                                    props={{ likes }}
                                    data={coffee}
                                    size="xs"
                                />
                            ))}
                        </div>
                    </div>
                </section>

                <section className="p-5 mt-20 lg:w-1/2 w-full">
                    <div className="flex flex-col gap-5">
                        <h3 className="font-semibold font-nyght text-xl">Your reviews</h3>

                        <div className="flex flex-wrap gap-5">
                            {reviews && reviews.map((review, index) => (
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
                </section>
            </main>


        </main>
    )
}