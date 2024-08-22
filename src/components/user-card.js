"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"

import Modal from "./modal"
import Popup from "./popup"
import { User } from "@/modules/icons"
import Label from "./label"
import Login from "@/modules/popup/login"

export default function UserCard({ avatar_url }) {
    return (
        <>
            {avatar_url ? (
                <Modal
                    variant="user"
                    trigger={
                        <Image
                            src={avatar_url}
                            alt="user avatar"
                            width={50}
                            height={50}
                            className="rounded-full border-2 border-brand/10"
                        />
                    } />
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
        </>
    )
}