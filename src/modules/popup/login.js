"use client"

import { useState } from "react"
import SignUpWithEmail from "./login/login-email"
import SignInWithOAuth from "./login/login-oauth"

export default function Login() {
    const [withEmail, setWithEmail] = useState(false)

    return (
        <>
            {withEmail ? (
                <SignUpWithEmail
                    changeToLogin={() => setWithEmail(false)}
                />
            ) : (
                <SignInWithOAuth
                    changeToSignInWithEmail={() => setWithEmail(true)}
                />
            )}
        </>
    )
}