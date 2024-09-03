"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import Link from "next/link"

import Topbar from "@/components/topbar"
import Review from "@/components/review"
import Button from "@/components/button"
import ReviewsForm from "@/components/reviews-form"
import ScrollGallery from "@/components/scroll-gallery"
import ReserveButton from "@/components/reserve-button"

// ICONS
import { Star, Location, Verified, Clock, Flame, Dollar, Phone, Tag, Heart, Share, Flag } from "@/modules/icons"
// ACTIONS
import { LikeAction } from "@/app/actions/like"
import { DislikeAction } from "@/app/actions/dislike"
import LoadingPage from "@/modules/loading-page"
import ReportCafePopup from "@/modules/popup/report-cafe"
import Popup from "@/components/popup"
import Login from "@/modules/popup/login"

export default function Cafe({ params }) {
    const supabase = createClient()

    const [avatar, setAvatar] = useState()
    const [name, setName] = useState()
    const [sid, setSid] = useState()

    const [data, setData] = useState()
    const [isOpened, setIsOpened] = useState()
    const [isBusy, setIsBusy] = useState()
    const [liked, setLiked] = useState(false)
    const [animating, setAnimating] = useState(false)

    const [showModal, setShowModal] = useState(false)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function getData() {
            const { data: { session } } = await supabase.auth.getSession()
            // if (!session) {
            //     window.location.href = "/"
            // }
            const { data, error } = await supabase
                .from("cafes")
                .select("*, likes(*), reviews(*)")
                .eq("slug_url", params.slug)


            setIsOpened(true)
            setIsBusy(false)

            if (session) {
                const { data: user } = await supabase
                    .from("users")
                    .select("avatar_url, name")
                    .eq("id", session.user.id)

                setAvatar(user[0].avatar_url)
                setName(user[0].name)
                setSid(session.user.id)

                const userLike = data[0].likes.find(like => like.user_id === session.user.id)
                setLiked(!!userLike)
            }

            setData(data[0])
            setLoading(false)
        }
        params && getData()
    }, [params])

    function capitalizarPrimeraLetra(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function handleShare() {
        if (navigator.share) {
            navigator.share({
                title: data.name,
                text: 'Check out this café!',
                url: window.location.href,
            }).catch((error) => console.error('Error sharing:', error))
        } else {
            navigator.clipboard.writeText(window.location.href)
            alert('Link copied to clipboard!')
        }
    }

    function handleLike() {
        // Verifica si el usuario está logueado
        if (!sid) {
            // Si no está logueado, muestra el popup de login
            setShowModal(true)
            return
        }
        // Cambia el estado de like
        setLiked(!liked);

        // Inicia la animación
        setAnimating(true);

        // Después de la animación, desactiva el estado animado
        setTimeout(() => setAnimating(false), 500); // Duración de la animación en milisegundos
    }

    return (
        <main>
            <Topbar
                avatar_url={avatar}
                name={name}
            />
            {
                loading ? (
                    <LoadingPage />
                ) : (
                    <section className="p-5 py-28 flex lg:flex-row flex-col gap-5">
                        <div className="flex flex-col gap-5 lg:w-2/3">
                            <div className="flex items-center justify-between">
                                <h1 className="text-5xl font-nyght">{data?.name}</h1>
                                <div className="flex flex-col lg:flex-row items-center gap-3">
                                    <Button
                                        className={`rounded-full hover:bg-white p-2 m-2 bg-lightgray`}
                                        onClick={handleShare}
                                    >
                                        <Share />
                                    </Button>
                                    <form
                                        className=""
                                        action={liked ? DislikeAction : LikeAction}
                                        onSubmit={handleLike}
                                    >
                                        <input name="postId" className="hidden" value={data.cafe_id}></input>
                                        <button
                                            type="submit"
                                            className={`rounded-full hover:bg-white p-2 m-2 bg-lightgray transition-transform duration-500 ease-in-out ${animating ? "scale-125" : ""
                                                }`}
                                        >
                                            <Heart color={liked ? "red" : "#6B6F7B"} />
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col items-start lg:flex-row lg:items-center gap-5">
                                    {data?.is_verified && <div className="flex items-center gap-2">
                                        <Verified size="20" />
                                        <span>Verified</span>
                                    </div>}
                                    <div className="flex items-center gap-2">
                                        <Star opacity="1" />
                                        <span className="font-semibold">
                                            {data?.score}
                                        </span>
                                        <span>({data?.ratings})</span>
                                    </div>
                                    <Link href={data?.url} className="flex items-center gap-2 underline hover:text-brand">
                                        <Location size="20" color="#CC7843" />
                                        <span>{data?.address?.length > 45 ? `${data.address.slice(0, 45)}...` : data?.address}</span>
                                    </Link>
                                    <ReportCafePopup
                                        cafeId={data.cafe_id}
                                        userId={sid}
                                    />
                                </div>
                            </div>
                            <ScrollGallery photos={data?.photos} />
                        </div>
                        <div className="flex flex-col gap-5 lg:w-1/3">
                            <div className="hidden lg:flex w-full">
                                <ReserveButton
                                    cafeId={data.cafe_id}
                                    userId={sid}
                                    cafeName={data.name}
                                    openingHours={data.opening_hours}
                                />
                            </div>
                            <hr className="text-gray lg:hidden" />
                            <div className="flex flex-col gap-5 p-5 text-lg">
                                <div className="flex items-center gap-5">
                                    <Tag size="24" color="#111111" />
                                    <span>{
                                        data.category ?
                                            capitalizarPrimeraLetra(data?.category?.replace("_", " "))
                                            : "Not provided"
                                    }</span>
                                </div>
                                <div className="flex items-center gap-5">
                                    <Clock size="24" color="#111111" />
                                    <span className={`${isOpened ? 'text-green' : 'text-red'}`}>
                                        {isOpened ? 'Open' : 'Closed'}
                                    </span>
                                </div>
                                <div className="flex items-center gap-5">
                                    <Flame size="24" color="#111111" />
                                    <span>{isBusy ? 'Busy Now' : 'Not Busy'}</span>
                                </div>
                                <div className="flex items-center gap-5">
                                    <Dollar size="24" color="#111111" />
                                    <span>{data.price ?
                                        capitalizarPrimeraLetra(data?.price.split("_")[2].toLowerCase())
                                        : "Not provided"
                                    }</span>
                                </div>
                                <div className="flex items-center gap-5">
                                    <Phone size="24" color="#111111" />
                                    <span>{data.phone ? data.phone : "Not provided"}</span>
                                </div>
                            </div>
                            <ReviewsForm
                                cafeId={data.cafe_id}
                                authorId={sid}
                                cafeSlug={data.slug_url}
                            />
                            {data?.reviews &&
                                data.reviews
                                    .slice()
                                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                    .map((review, index) => (
                                        <Review
                                            key={index}
                                            data={review}
                                        />
                                    ))}
                        </div>
                    </section>
                )
            }
            {
                !loading && (
                    <section className="lg:hidden fixed bottom-0 left-0 w-full bg-white text-black p-4">
                        <div className="flex justify-between items-center">
                            <ReserveButton
                                cafeId={data.cafe_id}
                                userId={sid}
                                cafeName={data.name}
                                openingHours={data.opening_hours}
                            />
                        </div>
                    </section>
                )
            }
            {showModal && (
                <Popup
                    opened
                    content={
                        <Login />
                    }
                />
            )}
        </main>
    )
}
