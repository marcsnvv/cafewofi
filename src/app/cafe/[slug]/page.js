"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import Link from "next/link"

import Topbar from "@/components/topbar"
import Label from "@/components/label"
import Review from "@/components/review"
import Button from "@/components/button"
import ReviewsForm from "@/components/reviews-form"

import { isOpen } from "@/utils/is-open"
import { isBusyToday } from "@/utils/is-busy"
import { useFormStatus } from 'react-dom'

// ICONS
import { Star, Location, Verified, Clock, Flame, Dollar, Phone, Tag, Heart, Share } from "@/modules/icons"
// ACTIONS
import { LikeAction, DislikeAction } from "@/app/actions/like"
import LoadingPage from "@/modules/loading-page"

export default function Cafe({ params }) {
    const supabase = createClient()
    const { pending } = useFormStatus()

    const [avatar, setAvatar] = useState()
    const [name, setName] = useState()
    const [sid, setSid] = useState()

    const [data, setData] = useState()
    const [isOpened, setIsOpened] = useState()
    const [isBusy, setIsBusy] = useState()

    const [loading, setLoading] = useState(true)
    const [imageError, setImageError] = useState(false)

    const [liked, setLiked] = useState(false)

    useEffect(() => {
        console.log(pending)
    }, [pending])

    useEffect(() => {
        async function getData() {
            const { data: { session } } = await supabase.auth.getSession()
            const { data, error } = await supabase
                .from("cafes")
                .select("*, likes(*), reviews(*)")
                .eq("cafe_id", params.slug)

            setIsOpened(isOpen(data[0].opening_hours))
            setIsBusy(isBusyToday(data[0].popular_times))

            const { data: user } = await supabase
                .from("users")
                .select("avatar_url, name")
                .eq("id", session.user.id)

            setAvatar(user[0].avatar_url)
            setName(user[0].name)
            setSid(session.user.id)

            const userLike = data[0].likes.find(like => like.user_id === session.user.id)
            setLiked(!!userLike)

            setData(data[0])
            setLoading(false)
        }
        params && getData()
    }, [params])

    async function handleLike() {
        try {
            const formData = new FormData();
            formData.append("postId", data.cafe_id);

            if (liked) {
                await DislikeAction(formData);
                setLiked(false);
            } else {
                await LikeAction(formData);
                setLiked(true);
            }
        } catch (error) {
            console.error('Error toggling like/dislike:', error);
        }
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
                    <section className="p-5 pt-28 flex lg:flex-row flex-col gap-5">
                        <div className="flex flex-col gap-5 lg:w-2/3">
                            <div className="flex items-center justify-between">
                                <h1 className="text-5xl font-nyght">{data?.name}</h1>
                                <div className="flex items-center gap-3">
                                    <Button
                                        className={`rounded-full hover:bg-white p-2 m-2 bg-lightgray`}
                                        onClick={handleShare}
                                    >
                                        <Share />
                                    </Button>
                                    <Button
                                        className={`rounded-full hover:bg-white p-2 m-2 bg-lightgray`}
                                        onClick={handleLike}
                                    >
                                        <Heart color={liked ? "red" : "#6B6F7B"} />
                                    </Button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    {data?.is_verified && <div className="flex items-center gap-2">
                                        <Verified />
                                        <span>Verified</span>
                                    </div>}
                                    <div className="flex items-center gap-2">
                                        <Star opacity="1" />
                                        <span className="font-semibold">
                                            {data?.score}
                                        </span>
                                        <span>({data?.ratings})</span>
                                    </div>
                                    <Link href={`https://www.google.es/maps/place/${data?.address.replace(" ", "+").replace("/", "+")}`} className="flex items-center gap-2 underline hover:text-brand">
                                        <Location size="24" color="#CC7843" />
                                        <span>{data?.address}</span>
                                    </Link>
                                </div>
                            </div>
                            <Image
                                src={imageError ? "/fallback-image.png" : data.main_image_url}
                                width={1080}
                                height={1080}
                                className="rounded-lg"
                                alt={data.name}
                                onError={() => setImageError(true)}
                            />
                        </div>
                        <div className="flex flex-col gap-5 lg:w-1/3">
                            <hr className="text-gray lg:hidden" />
                            <div className="flex flex-col gap-5 p-5 text-lg">
                                <div className="flex items-center gap-5">
                                    <Tag size="24" color="#111111" />
                                    <span>{data?.category}</span>
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
                                    <span>{data?.price_level}</span>
                                </div>
                                <div className="flex items-center gap-5">
                                    <Phone size="24" color="#111111" />
                                    <span>{data?.phone}</span>
                                </div>
                            </div>
                            <ReviewsForm cafeId={data.cafe_id} authorId={sid} />
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
        </main>
    )
}
