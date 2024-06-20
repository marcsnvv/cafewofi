import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import Image from "next/image"
import Topbar from "@/components/topbar"

import CoffeeCard from "@/components/cafe-card"
import Review from "@/components/review"

import ETS from "@/utils/elapsed"
import ThumbnailUploader from "@/components/thumbnail"

// BADGES
import { Verified, CoffeeMaker, WorkCafe } from "@/modules/badges"
import Tooltip from "@/components/tooltip"

export default async function Account() {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()
    const avatar = session?.user?.user_metadata?.avatar_url
    const name = session?.user?.user_metadata?.full_name

    const { data, error } = await supabase
        .from('users')
        .select(`
            *,
            reviews(*),
            likes(cafe_id, cafes(*))
        `)
        .eq('id', session.user.id)

    if (error) {
        console.error('Error fetching data:', error)
        return
    }

    const profile = data[0]
    const reviews = data[0]?.reviews
    const likes = data[0]?.likes.map(like => like.cafes)

    return (
        <main>
            <Topbar avatar={profile.avatar_url} name={name} noSearch />
            <section>
                {/* User thumbnail */}
                <ThumbnailUploader thumbnail_url={profile.thumbnail} userId={session.user.id} />
                <div className="-mt-14 flex h-auto m-5 px-2 bg-lightgray rounded-lg items-center">
                    <div>
                        <Image src={profile.avatar_url} width={120} height={120} className="rounded-lg" />
                    </div>
                    <div className="p-5 flex flex-col justify-between items-start gap-1 w-full">
                        <div className="flex justify-between items-center w-full">
                            <h2 className="text-2xl font-roboto font-semibold">{profile.name}</h2>
                            <div className="flex items-center gap-2">
                                {profile.is_premium && (
                                    <Tooltip text="Premium">
                                        <WorkCafe />
                                    </Tooltip>
                                )}
                                {profile.is_verified && (
                                    <Tooltip text="Verified by CWF">
                                        <Verified />
                                    </Tooltip>
                                )}
                                {profile.is_coffeemaker && (
                                    <Tooltip text="Coffee Maker">
                                        <CoffeeMaker />
                                    </Tooltip>
                                )}
                            </div>
                        </div>
                        <h2 className="text-lg text-gray font-roboto">@{profile.username}</h2>
                        <span className="text-sm text-gray">
                            Member since {ETS(profile.created_at)}
                        </span>
                    </div>
                </div>
            </section>

            <main className="flex lg:flex-row flex-col justify-between">

                <section className="p-5 lg:w-1/2 w-full">
                    <div className="flex flex-col gap-5">
                        <h3 className="font-semibold font-nyght text-xl">Cafes you like</h3>

                        <div className="grid grid-cols-2 gap-5">
                            {likes && likes.map((coffee, index) => (
                                <CoffeeCard
                                    key={index}
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
                                    avatar={profile.avatar_url}
                                    name={name}
                                    username={profile.username}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            </main>


        </main>
    )
}