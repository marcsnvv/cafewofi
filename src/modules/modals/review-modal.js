"use client"

import { useState, useEffect } from "react"
import { Trash, User } from "@/modules/icons"
import Link from "next/link"
import Popup from "@/components/popup"
import Button from "@/components/button"
import { DeleteReviewAction } from "@/app/actions/delete-review"
import Loading from "@/components/loading"

export default function ReviewModal({ username, userId, reviewData }) {
    const [open, setOpen] = useState()
    const [isAuthor, setIsAuthor] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (reviewData.author_id === userId) {
            setIsAuthor(true)
        }
    }, [])

    function closeHandler() {
        setOpen(false)
    }

    async function handleSubmit() {
        setLoading(true)

        await DeleteReviewAction(reviewData.id, userId)

        setLoading(false)
        closeHandler()
    }

    return (
        <div className="w-28 border border-gray rounded-lg bg-white overflow-hidden">
            <Link href={`/${username}`} className="flex items-center justify-start p-1.5 hover:bg-lightbrand">
                <User color="#111111" />
                <span className="ml-4">Profile</span>
            </Link>
            <hr className="border-t border-gray" />
            {
                isAuthor && (
                    <div className="cursor-pointer flex items-center justify-start p-1.5 hover:bg-lightbrand">
                        <Trash color="#111111" />

                        <button onClick={() => setOpen(true)}>
                            <span className="ml-4">
                                Delete
                            </span>
                        </button>
                        <Popup
                            opened={open}
                            closeHandler={closeHandler}

                            content={
                                <div className="p-4 flex flex-col gap-5">
                                    <h2 className="text-xl font-bold">Delete Review?</h2>
                                    <span className="text-gray block">Giving an opinion is not illegal! It is an act of freedom. Are you sure you want to delete the review? This action cannot be reversed.</span>
                                    <div className="flex gap-4">
                                        <Button
                                            onClick={() => handleSubmit()}
                                        >
                                            {loading ? <Loading size="16" /> : "Yes, delete"}
                                        </Button>
                                        <Button
                                            onClick={() => closeHandler()}
                                            variant="secondary"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            }
                        />
                    </div>
                )
            }

        </div>
    )
}
