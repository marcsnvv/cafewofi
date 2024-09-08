"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/utils/supabase/client"

import Modal from "./modal"
import Popup from "./popup"
import { User, Diamond } from "@/modules/icons"
import Label from "./label"
import Login from "@/modules/popup/login"
import UserModal from "@/modules/modals/user"

export default function UserCard({ user }) {
    const supabase = createClient()
    const [points, setPoints] = useState()

    useEffect(() => {
        async function getData() {
            const { data: { session } } = await supabase.auth.getSession()
            const { data, error } = await supabase
                .from("points")
                .select("total_points")
                .eq("user_id", session.user.id)

            if (error) {
                setPoints(0)
                console.error(error)
            } else {
                if (!data) {
                    setPoints(0)
                } else {
                    setPoints(data[0].total_points)
                }
            }
        }

        getData()
    }, [user])

    return (
        <div className="flex gap-5 items-center justify-center">
            <Link href={"/milestones"} className="px-2 py-1 gap-2 flex items-center justify-centerp-2 rounded-full bg-white text-gray">
                <Diamond color="#CC7843" />
                <span>{points}</span>
            </Link>
            {user?.avatar_url ? (
                <Modal
                    variant="user"
                    trigger={
                        <Image
                            src={user.avatar_url}
                            alt="user avatar"
                            width={50}
                            height={50}
                            className="rounded-full border-2 border-brand/10"
                        />
                    } >
                    <UserModal />
                </Modal>
            ) : (
                <Popup
                    trigger={
                        <Label variant="info rounded">
                            <User className="w-[50px] h-[50px]" />
                        </Label>
                    }
                    content={
                        <Login />
                    }
                />
            )}
        </div>
    )
}