"use client"

import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import Topbar from "@/components/topbar"
import CoffeeCard from "@/components/cafe-card"
import Review from "@/components/review"
import ETS from "@/utils/elapsed"
import Thumbnail from "@/components/thumbnail"
import Tooltip from "@/components/tooltip"
import Button from "@/components/button"
import { Verified, WorkCafe, CoffeeMaker } from "@/modules/badges"
import { At } from "@/modules/icons"
import addFriend from "@/app/actions/add-friend"
import LoadingPage from "@/modules/loading-page"
import { redirect } from "next/navigation"

export default function User({ params }) {
    const supabase = createClient()
    const [loading, setLoading] = useState(true)
    const [profile, setProfile] = useState()
    const [reviews, setReviews] = useState()
    const [likes, setLikes] = useState()
    const [avatar, setAvatar] = useState()
    const [friendStatus, setFriendStatus] = useState()
    const [isFriend, setIsFriend] = useState(false)
    const [activeSection, setActiveSection] = useState('likes')

    const [commonFriends, setCommonFriends] = useState([])

    useEffect(() => {
        async function getData() {
            const { data: { session } } = await supabase.auth.getSession()

            if (!session) {
                window.location.href = "/"
            }

            if (session.user.user_metadata.user_name === params.username) {
                window.location.href = "/account"
            }

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

            // Obtener datos del usuario logueado utilizando session.user.id
            const { data: loggedInUserData, error: loggedInUserError } = await supabase
                .from('users')
                .select('avatar_url')
                .eq('id', session.user.id)
                .single();

            if (loggedInUserError) {
                console.error("Error fetching logged-in user data:", loggedInUserError);
                return;
            }

            setAvatar(loggedInUserData.avatar_url)






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
                        name,
                        photos
                    )
                `)
                .eq('user_id', userData.id)

            if (likesError) {
                console.log(likesError)
                return
            }

            // Obtener amigos del usuario visitado
            const { data: visitedUserFriends, error: visitedUserFriendsError } = await supabase
                .from('friends')
                .select('friend_id')
                .or(`user_id.eq.${userData.id},friend_id.eq.${userData.id}`)


            if (visitedUserFriendsError) {
                console.log(visitedUserFriendsError)
                return
            }

            // Obtener amigos del usuario logueado
            const { data: loggedUserFriends, error: loggedUserFriendsError } = await supabase
                .from('friends')
                .select('friend_id')
                .or(`user_id.eq.${session.user.id},friend_id.eq.${session.user.id}`)

            if (loggedUserFriendsError) {
                console.log(loggedUserFriendsError)
                return
            }

            // Encontrar amigos comunes
            const commonFriendIds = visitedUserFriends
                .filter(vuf => loggedUserFriends.some(luf => luf.friend_id === vuf.friend_id))
                .map(f => f.friend_id)

            // Obtener detalles de los amigos comunes
            if (commonFriendIds.length > 0) {
                console.log(session.user.id)
                console.log(commonFriendIds)
                if (commonFriendIds.length === 1 && commonFriendIds[0] === userData.id) {
                    setIsFriend(true)
                } else {
                    const { data: commonFriendsData, error: commonFriendsError } = await supabase
                        .from('users')
                        .select('id, name, username, avatar_url')
                        .in('id', commonFriendIds)

                    if (commonFriendsError) {
                        console.log("COMMON FRIENDS ERROR:", commonFriendsError)
                    } else {
                        setCommonFriends(commonFriendsData)
                    }
                }

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

            setFriendStatus(notificationsData?.status)
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

    return (
        <main>
            <Topbar
                avatar_url={avatar}
                noSearch
                uAuto
                username={profile?.username}
            />
            {loading ? (
                <LoadingPage />
            ) : (
                <main className="w-full flex items-center justify-center">
                    <div className="lg:max-w-xl w-full">
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
                                                <Tooltip text="Verified">
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
                        <div className="w-full flex items-center gap-2 mb-4 px-5">
                            {/* ... badges existentes ... */}
                            {isFriend ? (
                                <Button className="w-full" variant="secondary" disabled>Already friends</Button>
                            ) : friendStatus === 'pending' ? (
                                <Button className="w-full" disabled>Request pending</Button>
                            ) : (
                                <Button className="w-full" onClick={handleAddFriend}>Add friend</Button>
                            )}
                        </div>

                        {/* Toggle buttons */}
                        <div className="flex justify-around mb-5 text-base font-nyght">
                            <button
                                className={`p-2 ${activeSection === 'likes' ? 'text-darkgray' : 'text-gray'} rounded-lg`}
                                onClick={() => setActiveSection('likes')}
                            >
                                Cafes {profile?.name} like
                            </button>
                            <button
                                className={`p-2 ${activeSection === 'reviews' ? 'text-darkgray' : 'text-gray'} rounded-lg`}
                                onClick={() => setActiveSection('reviews')}
                            >
                                {profile?.name}'s reviews
                            </button>
                            <button
                                className={`p-2 ${activeSection === 'friends' ? 'text-darkgray' : 'text-gray'} rounded-lg`}
                                onClick={() => setActiveSection('commonFriends')}
                            >
                                Common friends
                            </button>
                        </div>

                        {/* Content Sections */}
                        {
                            activeSection === 'likes' && (
                                <div className="grid lg:grid-cols-2 grid-cols-1 gap-5 p-5">
                                    {likes.length > 0 ? (
                                        likes
                                            .slice()
                                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                            .map((coffee, index) => (
                                                <CoffeeCard
                                                    key={index}
                                                    props={{ likes }}
                                                    data={coffee}
                                                    size="xs"
                                                />
                                            ))
                                    ) : (
                                        <p className="text-gray">No likes found.</p>
                                    )}
                                </div>
                            )
                        }

                        {
                            activeSection === 'reviews' && (
                                <div className="flex flex-wrap gap-5 p-5">
                                    {reviews.length > 0 ? (
                                        reviews
                                            .slice()
                                            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                            .map((review, index) => (
                                                <Review
                                                    key={index}
                                                    data={review}
                                                    avatar={profile?.avatar_url}
                                                    name={profile?.name}
                                                    username={profile?.username}
                                                />
                                            ))
                                    ) : (
                                        <p className="text-gray">No reviews found.</p>
                                    )}
                                </div>
                            )
                        }

                        {
                            activeSection === 'commonFriends' && (
                                <div className="grid gap-5 px-5 py-1 border-b border-lightbrand">
                                    {commonFriends.length > 0 ? (
                                        commonFriends.map((friend, index) => {
                                            const truncateText = (text) => {
                                                return text.length > 15 ? text.substring(0, 9) + '...' : text;
                                            }

                                            return (
                                                <Link key={index} href={`/${friend.username}`}>
                                                    <div className="flex items-center gap-3">
                                                        <Image src={friend.avatar_url || '/default-avatar.png'} width={50} height={50} className="rounded-full" alt={friend.name} />
                                                        <div>
                                                            <h4 className="font-semibold">{truncateText(friend.name)}</h4>
                                                            <span className="text-gray">@{truncateText(friend.username)}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    ) : (
                                        <p className="text-gray">No mutual friends</p>
                                    )}
                                </div>
                            )
                        }
                    </div>
                </main>
            )}
        </main>
    )
}
