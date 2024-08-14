"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import Link from "next/link"

import Topbar from "@/components/topbar"
import Label from "@/components/label"
import Review from "@/components/review"
import Button from "@/components/button"

import { isOpen } from "@/utils/is-open"
import { isBusyToday } from "@/utils/is-busy"
import { useFormStatus } from 'react-dom'

// ICONS
import { Star, Location, Verified, Clock, Flame, Dollar, Phone, Tag, PaperPlane } from "@/modules/icons"
import { WriteReviewAction } from "@/app/actions/write-review"
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

    const [formError, setFormError] = useState()
    const [reviewStars, setReviewStars] = useState(0)

    const [loading, setLoading] = useState(true)
    const [imageError, setImageError] = useState(false) // Estado para manejar el error de la imagen

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

            setData(data[0])
            setLoading(false)
        }
        params && getData()
    }, [params])

    function validateForm(event) {
        event.preventDefault(); // Evita que el formulario se envíe automáticamente

        const content = document.getElementById('content').value

        // Validar que se haya seleccionado al menos 1 estrella
        if (reviewStars < 1 || reviewStars > 5) {
            setFormError('Please select at least 1 star.');
            return;
        }

        // Validar que el campo de contenido tenga al menos 10 caracteres
        if (content.length < 10) {
            setFormError('Content must be at least 10 characters long.');
            return;
        }

        console.log('Form validated successfully!');
        setFormError(null)
    }

    function handleImageError() {
        setImageError(true); // Maneja el error de la imagen
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
                            <h1 className="text-5xl font-nyght">{data?.name}</h1>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    {data?.is_verified && <div className="flex items-center gap-2">
                                        <Verified />
                                        <span>
                                            Verified
                                        </span>
                                    </div>}
                                    <div className="flex items-center gap-2">
                                        <Star opacity="1" />
                                        <span className="font-semibold">
                                            {data?.score}
                                        </span>
                                        <span>
                                            ({data?.ratings})
                                        </span>
                                    </div>
                                    <Link href={`https://www.google.es/maps/place/${data?.address.replace(" ", "+").replace("/", "+")}`} className="flex items-center gap-2 underline hover:text-brand">
                                        <Location size="24" color="#CC7843" />
                                        <span>
                                            {data?.address}
                                        </span>
                                    </Link>

                                </div>
                            </div>
                            <Image
                                src={imageError ? "/fallback-image.png" : data.main_image_url}
                                width={1080}
                                height={1080}
                                className="rounded-lg"
                                alt={data.name}
                                onError={handleImageError} // Maneja el error de carga de la imagen
                            />
                        </div>
                        <div className="flex flex-col gap-5 lg:w-1/3">
                            <hr className="text-gray lg:hidden" />
                            <div className="flex flex-col gap-5 p-5 text-lg">
                                <div className="flex items-center gap-5">
                                    <Tag size="24" color="#111111" />
                                    <span>
                                        <span className="font-semibold">Category:</span>{" "}
                                        {data?.category && data.category.length > 30
                                            ? `${data.category.slice(0, 20)}...`
                                            : data?.category}
                                    </span>
                                </div>
                                <div className="flex items-center gap-5">
                                    <Dollar size="24" color="#111111" />
                                    <span>
                                        <span className="font-semibold">Price:</span> {data?.price}
                                    </span>
                                </div>
                                <div className="flex items-center gap-5">
                                    <Phone size="24" color="#111111" />
                                    <span>
                                        <span className="font-semibold">Phone number:</span> {data?.phone}
                                    </span>
                                </div>
                            </div>
                            <hr className="text-gray lg:hidden" />
                            <div className="flex flex-col gap-5 p-5 text-lg">
                                <div className="flex items-center gap-5">
                                    <Clock size="24" color="#111111" />
                                    <span className="flex items-center gap-5">
                                        <span className="font-semibold">Opening hours:</span> {isOpened ?
                                            <Label variant="green">Opened</Label> :
                                            <Label variant="red">Closed</Label>
                                        }
                                    </span>
                                </div>
                                <div className="flex items-center gap-5">
                                    <Flame size="24" color="#111111" />
                                    <span className="flex items-center gap-5">
                                        <span className="font-semibold">Popular times:</span> {isBusy ?
                                            <Label variant="orange">It's a little crowded</Label> :
                                            <Label variant="green">It's not busy</Label>
                                        }
                                    </span>
                                </div>
                            </div>
                            <hr className="text-gray lg:hidden" />
                            <div className="flex flex-col gap-5">
                                <span className="font-nyght text-2xl">Reviews</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setReviewStars(1)}>
                                        <Star opacity={reviewStars >= 1 ? "1" : "0.3"} />
                                    </button>
                                    <button onClick={() => setReviewStars(2)}>
                                        <Star opacity={reviewStars >= 2 ? "1" : "0.3"} />
                                    </button>
                                    <button onClick={() => setReviewStars(3)}>
                                        <Star opacity={reviewStars >= 3 ? "1" : "0.3"} />
                                    </button>
                                    <button onClick={() => setReviewStars(4)}>
                                        <Star opacity={reviewStars >= 4 ? "1" : "0.3"} />
                                    </button>
                                    <button onClick={() => setReviewStars(5)}>
                                        <Star opacity={reviewStars >= 5 ? "1" : "0.3"} />
                                    </button>
                                </div>
                                <form className="relative grid gap-4" id="reviewForm" action={WriteReviewAction} disabled={pending}>
                                    <input className="hidden" name="cafe_id" value={data.cafe_id} />
                                    <input className="hidden" name="author_id" value={sid} />
                                    <input className="hidden" name="rating" value={reviewStars} />
                                    <textarea
                                        onChange={(e) => validateForm(e)}
                                        name="content"
                                        id="content"
                                        minLength={1}
                                        maxLength={350}
                                        rows={3}
                                        wrap
                                        className={`
                    ${formError
                                                ? "border-2 border-red-500 bg-red-200 focus:outline-none"
                                                : "focus:outline-none focus:ring-2 focus:ring-brand"}
                    bg-lightbrand rounded-lg p-4 resize-y min-h-[100px] max-h-[205px] overflow-hidden
                    `}
                                        placeholder="Write a review..."
                                    />

                                    <div className="absolute right-2 bottom-2">
                                        <Button
                                            variant="primary-rounded"
                                            type="submit"
                                            disabled={formError != null && true}
                                        >
                                            <PaperPlane size="20" color="white" />
                                        </Button>
                                    </div>
                                </form>
                                {formError &&
                                    <span className="text-red-500">{formError}</span>
                                }

                                {data?.reviews &&
                                    data.reviews
                                        .slice() // Hacemos una copia para no modificar el array original
                                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)) // Ordenamos por fecha de creación de más reciente a más antiguo
                                        .map((review, index) => (
                                            <Review
                                                key={index}
                                                data={review}
                                            />
                                        ))}
                            </div>
                        </div>
                    </section>
                )
            }
        </main>
    )
}
