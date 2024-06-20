"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useEffect, useState } from "react"

import Link from "next/link"
import { Star, At, User } from "@/modules/icons"
import Label from "./label"
import ETS from "@/utils/elapsed"

export default function Review({ data, avatar, name, username }) {
    const supabase = createClientComponentClient()
    const [un, setUn] = useState(username)
    const [nm, setNm] = useState(name)
    const [av, setAv] = useState(avatar)
    const [linkTo, setLinkTo] = useState(null)

    useEffect(() => {
        async function getUserData() {
            const { data: userData, error } = await supabase
                .from("users")
                .select("name, username, avatar_url")
                .eq("id", data.author_id)

            if (!un && !nm && !av) {
                console.log(userData[0].avatar_url)
                setAv(userData[0].avatar_url)
                setNm(userData[0].name)
                setUn(userData[0].username)
                setLinkTo("/" + userData[0].username)
            }
        }

        data && getUserData()
    }, [data])

    return (
        <Link href={linkTo ? linkTo : `/cafe/${data.cafe_id}`} className="grid gap-4 p-5 rounded-lg hover:bg-lightgray">
            <div className="grid gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {av ? (
                            <img src={av} className="w-[45px] h-[45px] rounded-full" />
                        ) : (
                            <Label variant="info rounded">
                                <User className="w-[45px] h-[45px]" />
                            </Label>
                        )}
                        <div className="grid">
                            <div className="flex items-center justify-start gap-4">
                                <span className="font-semibold">{nm}</span>
                                <div className="flex items-center">
                                    <div className="mt-1">
                                        <At size="14" />
                                    </div>
                                    <span className="text-gray">{un}</span>
                                </div>
                            </div>
                            <span className="text-sm text-gray">
                                {ETS(data.created_at)}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <Star opacity="1" />
                            <Star opacity="1" />
                            <Star opacity="1" />
                            <Star opacity="1" />
                            <Star />
                        </div>
                        <span>{data.rating}</span>
                    </div>
                </div>
            </div>

            <span className="text-lg">
                {data.content}
            </span>
        </Link >
    )
}