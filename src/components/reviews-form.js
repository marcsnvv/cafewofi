"use client"

import { useState, useEffect } from "react"
import { Star, PaperPlane } from "@/modules/icons"
import Button from "@/components/button"
import { WriteReviewAction } from "@/app/actions/write-review"
import Popup from "./popup"
import Login from "@/modules/popup/login"
import { useFormStatus } from 'react-dom'

export default function ReviewsForm({ cafeId, cafeSlug, authorId }) {
    const status = useFormStatus()

    const [reviewStars, setReviewStars] = useState(0)
    const [formError, setFormError] = useState(null)

    // LOGIN MODAL
    const [showModal, setShowModal] = useState(false)


    useEffect(() => {
        console.log(status)
    }, [status])


    function validateForm(event) {
        event.preventDefault();

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

        if (!authorId) {
            setShowModal(true)
            return
        }

        console.log('Form validated successfully!');
        setFormError(null)
    }

    return (
        <div className="flex flex-col gap-5">
            <span className="font-nyght text-2xl">Reviews</span>
            <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                    <button key={value} onClick={() => setReviewStars(value)}>
                        <Star opacity={reviewStars >= value ? "1" : "0.3"} />
                    </button>
                ))}
            </div>
            <form className="relative grid gap-4" id="reviewForm" action={WriteReviewAction} disabled={formError != null}>
                <input className="hidden" name="cafe_id" value={cafeId} />
                <input className="hidden" name="slug_url" value={cafeSlug} />
                <input className="hidden" name="author_id" value={authorId} />
                <input className="hidden" name="rating" value={reviewStars} />
                <textarea
                    onChange={(e) => validateForm(e)}
                    name="content"
                    id="content"
                    minLength={1}
                    maxLength={350}
                    rows={3}
                    wrap="hard"
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
                        disabled={formError != null}
                    >
                        <PaperPlane size="20" color="white" />
                    </Button>
                </div>
            </form>
            {formError &&
                <span className="text-red-500">{formError}</span>
            }

            {showModal && (
                <Popup
                    opened
                    content={
                        <Login />
                    }
                />
            )}
        </div>
    )
}
