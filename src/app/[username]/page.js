"use client"

import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import Image from "next/image"
import Topbar from "@/components/topbar"
import CoffeeCard from "@/components/cafe-card"
import Review from "@/components/review"
import ETS from "@/utils/elapsed"
import Thumbnail from "@/components/thumbnail"
import Tooltip from "@/components/tooltip"
import { Verified, WorkCafe, CoffeeMaker } from "@/modules/badges"
import { At } from "@/modules/icons"
import addFriend from "@/app/actions/add-friend"

export default function User({ params }) {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState()
    const [reviews, setReviews] = useState()
    const [likes, setLikes] = useState()
    const [avatar, setAvatar] = useState()
    const [friendStatus, setFriendStatus] = useState()
    const [isFriend, setIsFriend] = useState(false)

    useEffect(() => {
        async function getData() {
            const { data: { session } } = await supabase.auth.getSession()
            setAvatar(session?.user?.user_metadata?.avatar_url)

            // Obtener datos del usuario
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select(`
                    id,
                    username,
                    name,
                    avatar_url,
                    thumbnail,
                    is_premium,
                    is_verified,
                    is_coffeemaker,
                    created_at
                `)
                .eq('username', params.username)
                .single()

            if (userError || !session?.user) {
                console.log(userError)
                return
            }

            // Obtener revisiones del usuario
            const { data: reviewsData, error: reviewsError } = await supabase
                .from('reviews')
                .select('*')
                .eq('author_id', userData.id)

            if (reviewsError) {
                console.log(reviewsError)
                return
            }

            // Obtener gustos del usuario
            const { data: likesData, error: likesError } = await supabase
                .from('likes')
                .select(`
                    cafes (
                        cafe_id,
                        name
                    )
                `)
                .eq('user_id', userData.id)

            if (likesError) {
                console.log(likesError)
                return
            }

            // Obtener amigos del usuario
            const { data: friendsData, error: friendsError } = await supabase
                .from('friends')
                .select('friend_id')
                .eq('user_id', userData.id)

            if (friendsError) {
                console.log(friendsError)
                return
            }

            // Obtener notificaciones del usuario
            const { data: notificationsData, error: notificationsError } = await supabase
                .from('notifications')
                .select('status')
                .eq('sender_id', session.user.id)
                .eq('recipient_id', userData.id)
                .eq('type', 'friend_request')
                .single()

            if (notificationsError) {
                console.log(notificationsError)
            }

            const isFriend = friendsData?.some(friend => friend.friend_id === session.user.id)
            setFriendStatus(notificationsData?.status)
            setIsFriend(isFriend)
            setProfile(userData)
            setReviews(reviewsData)
            setLikes(likesData?.map(like => like.cafes))
            setLoading(false)
        }

        params && getData()
    }, [params])

    const handleAddFriend = async () => {
        try {
            const result = await addFriend({ recipient_id: profile.id })
            if (result.status === 'success') {
                setFriendStatus('pending')
            } else if (result.status === 'error') {
                console.log(result.message)
                if (result.message.includes('unique_friendship')) {
                    setFriendStatus('pending')
                }
            }
        } catch (error) {
            console.error("Error sending friend request:", error)
        }
    }

    if (loading) return <div>Loading...</div>

    return (
        <main>
            <Topbar
                avatar_url={avatar}
                noSearch
                uAuto
                username={profile?.username}
            />
            <section>
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

            <section className="flex flex-col items-center mt-4">
                {isFriend ? (
                    <button className="btn btn-disabled">Already Friends</button>
                ) : friendStatus === 'pending' ? (
                    <button className="btn btn-disabled">Friend Request Sent</button>
                ) : (
                    <button onClick={handleAddFriend} className="btn btn-primary">Add Friend</button>
                )}
            </section>

            <section className="flex lg:flex-row flex-col justify-between">
                <div className="p-5 lg:w-1/2 w-full">
                    <div className="flex flex-col gap-5">
                        <h3 className="font-semibold font-nyght text-xl">Cafes that {profile?.name} likes</h3>

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
                        <h3 className="font-semibold font-nyght text-xl">{profile?.name}'s reviews</h3>

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
