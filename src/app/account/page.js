import { createClient } from "@/utils/supabase/server"
import { redirect } from 'next/navigation'

import Image from "next/image"
import Topbar from "@/components/topbar"
import CoffeeCard from "@/components/cafe-card"
import Review from "@/components/review"
import ThumbnailUploader from "@/components/thumbnail"
import Tooltip from "@/components/tooltip"
import { Verified, CoffeeMaker, WorkCafe } from "@/modules/badges"
import { At } from "@/modules/icons"
import ETS from "@/utils/elapsed"

export default async function Account() {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    const avatar = session?.user?.user_metadata?.avatar_url
    const name = session?.user?.user_metadata?.full_name

    // Obtener datos del usuario
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
            *,
            reviews(*),
            likes(cafe_id, cafes(*))
        `)
        .eq('id', session?.user?.id)
        .single();

    if (userError || !userData) {
        redirect('/')
    }

    // Obtener amigos del usuario
    const { data: friendsData, error: friendsError } = await supabase
        .from('friends')
        .select(`
            *,
            friend:users(username, avatar_url, name)
        `)
        .eq('user_id', session?.user?.id);

    if (friendsError) {
        console.error('Error fetching friends:', friendsError)
    }

    const profile = userData
    const reviews = profile?.reviews
    const likes = profile?.likes.map(like => like.cafes)
    const friends = friendsData?.map(friend => friend.friend) // Mapear los amigos a la estructura correcta

    return (
        <main>
            <Topbar
                avatar_url={profile.avatar_url}
                name={name}
                noSearch
                uAuto
                username={profile.username}
            />
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
                        <h2 className="text-lg text-gray font-roboto flex items-center justify-center gap-1">
                            <div className="mt-1">
                                <At />
                            </div>
                            {profile?.username}
                        </h2>
                        <span className="text-sm text-gray">
                            Member since {ETS(profile.created_at)}
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
                                            avatar={profile.avatar_url}
                                            name={name}
                                            username={profile.username}
                                        />
                                    ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Sección de amigos */}
            <section className="p-5 lg:w-full w-auto">
                <div className="flex flex-col gap-5">
                    <h3 className="font-semibold font-nyght text-xl">Your Friends</h3>
                    <div className="grid grid-cols-2 gap-5">
                        {friends && friends.length > 0 ? (
                            friends.map((friend, index) => (
                                <div key={index} className="flex items-center gap-3 p-3 bg-lightgray rounded-lg">
                                    <Image src={friend.avatar_url || '/default-avatar.png'} width={50} height={50} className="rounded-full" alt={friend.name} />
                                    <div>
                                        <h4 className="font-semibold">{friend.name}</h4>
                                        <span className="text-gray">@{friend.username}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray">No friends found.</p>
                        )}
                    </div>
                </div>
            </section>
        </main>
    )
}
