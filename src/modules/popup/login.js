"use client"

import { useState } from "react"
import SignUpWithEmail from "./login/login-email"
import SignInWithOAuth from "./login/login-oauth"
import { Close } from "@/modules/icons"

export default function Login({
    setModal,
}) {
    const [withEmail, setWithEmail] = useState(false)

    return (
        <div className="bg-white p-2 rounded-lg flex flex-col gap-4">
            <button
                className="absolute z-50 top-4 right-4 p-2 rounded-full hover:bg-gray/25"
                onClick={() => setModal(false)}
            >
                <Close />
            </button>
            {withEmail ? (
                <SignUpWithEmail
                    changeToLogin={() => setWithEmail(false)}
                />
            ) : (
                <SignInWithOAuth
                    changeToSignInWithEmail={() => setWithEmail(true)}
                />
            )}
        </div>
    )
}