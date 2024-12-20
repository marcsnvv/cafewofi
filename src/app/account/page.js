"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"

import Image from "next/image"
import Topbar from "@/components/topbar"
import CoffeeCard from "@/components/cafe-card"
import Review from "@/components/review"
import ThumbnailUploader from "@/components/thumbnail"
import Tooltip from "@/components/tooltip"
import { Verified, CoffeeMaker, WorkCafe } from "@/modules/badges"
import { At } from "@/modules/icons"
import ETS from "@/utils/elapsed"
import Loading from "@/components/loading"
import Link from "next/link"
import LoadingPage from "@/modules/loading-page"

export default function Account() {
    const [profile, setProfile] = useState(null)
    const [likes, setLikes] = useState([])
    const [reviews, setReviews] = useState([])
    const [friends, setFriends] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeSection, setActiveSection] = useState('likes')

    const router = useRouter()

    useEffect(() => {
        const supabase = createClient()

        const fetchData = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession()

                if (!session) {
                    router.push('/')
                    return
                }

                // Obtener datos del usuario
                const { data: userData, error: userError } = await supabase
                    .from('users')
                    .select(`
                        *,
                        reviews(*),
                        likes(cafe_id, cafes(*))
                    `)
                    .eq('id', session?.user?.id)
                    .single()

                if (userError || !userData) {
                    router.push('/')
                    return
                }

                const userId = session.user.id;

                // Obtener amigos del usuario
                const { data: friendsData, error: friendsError } = await supabase
                    .from('friends')
                    .select(`
                        *,
                        user:users!friends_user_id_fkey(id, username, avatar_url, name),
                        friend:users!friends_friend_id_fkey(id, username, avatar_url, name)
                    `)
                    .or(`user_id.eq.${userId},friend_id.eq.${userId}`) // Usar el ID del usuario desde la sesión en ambas columnas
                    .eq('status', 'accepted') // Filtrar por estado "accepted"
                    .order('created_at', { ascending: false });

                if (friendsError) {
                    throw new Error(`Error fetching friends: ${friendsError.message}`)
                }

                // Filtrar la información del amigo dependiendo del userId
                const filteredFriendsData = friendsData.map(friendship => {
                    if (friendship.user_id === userId) {
                        return {
                            ...friendship.friend, // Información del amigo
                            friend_id: friendship.friend_id,
                        };
                    } else {
                        return {
                            ...friendship.user, // Información del amigo
                            friend_id: friendship.user_id,
                        };
                    }
                });

                // Actualizar estado
                setProfile(userData)
                setReviews(userData.reviews)
                setLikes(userData.likes.map(like => like.cafes))
                setFriends(filteredFriendsData)
                setIsLoading(false)
            } catch (error) {
                console.error('Error fetching data:', error)
                router.push('/')
            }
        }

        fetchData()
    }, [router])

    return (
        <main>
            <Topbar
                avatar_url={profile?.avatar_url}
                name={profile?.name}
                noSearch
                uAuto
                username={profile?.username}
            />

            {isLoading ? (
                <LoadingPage />
            ) : (
                <main className="w-full flex items-center justify-center">
                    <div className="lg:max-w-xl w-full">
                        <section >
                            {/* User thumbnail */}
                            <ThumbnailUploader thumbnail_url={profile?.thumbnail} userId={profile?.id} />
                            <div className="-mt-14 flex h-auto m-5 px-2 bg-lightgray rounded-lg items-center">
                                <div>
                                    <img src={profile?.avatar_url} width={120} height={120} className="rounded-lg" />
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

                        {/* Toggle buttons */}
                        <div className="flex justify-around mb-5 text-base font-nyght">
                            <button
                                className={`p-2 ${activeSection === 'likes' ? 'text-darkgray' : 'text-gray'} rounded-lg`}
                                onClick={() => setActiveSection('likes')}
                            >
                                Cafes you like
                            </button>
                            <button
                                className={`p-2 ${activeSection === 'reviews' ? 'text-darkgray' : 'text-gray'} rounded-lg`}
                                onClick={() => setActiveSection('reviews')}
                            >
                                Your reviews
                            </button>
                            <button
                                className={`p-2 ${activeSection === 'friends' ? 'text-darkgray' : 'text-gray'} rounded-lg`}
                                onClick={() => setActiveSection('friends')}
                            >
                                Your Friends
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
                            activeSection === 'friends' && (
                                <div className="grid gap-5 px-5 py-1 pb-5 border-b border-lightbrand">
                                    {friends.length > 0 ? (
                                        friends.map((friend, index) => {
                                            // Función para truncar el texto si supera los 15 caracteres
                                            const truncateText = (text) => {
                                                return text.length > 15 ? text.substring(0, 9) + '...' : text;
                                            }

                                            return (
                                                <Link key={index} href={`/${friend.username}`}>
                                                    <div className="flex items-center gap-3">
                                                        <Image src={friend.avatar_url || '/default-avatar.png'} width={50} height={50} className="rounded-full" alt={friend.name} />
                                                        <div>
                                                            {/* Aplicar la función de truncar a name y username */}
                                                            <h4 className="font-semibold">{truncateText(friend.name)}</h4>
                                                            <span className="text-gray">@{truncateText(friend.username)}</span>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })
                                    ) : (
                                        <p className="text-gray">No friends found.</p>
                                    )}
                                </div>
                            )
                        }
                    </div>
                </main>
            )
            }

        </main >
    )
}
