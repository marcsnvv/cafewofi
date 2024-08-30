"use client"

import { createClient } from '@/utils/supabase/client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Google, X } from '@/modules/icons'
import Button from '@/components/button'
import Link from 'next/link'

export default function LoginPage() {
    const [loading, setLoading] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkAuthStatus = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            if (session) {
                router.push("/")
                setIsLoggedIn(true)
            }
        }
        checkAuthStatus()
    }, [])

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({ provider: "google" })
        if (error) {
            console.log(error)
            redirect('/error')  // Redirigir en caso de error
        }
    }

    const handleXLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({ provider: "twitter" })
        if (error) {
            console.log(error)
            redirect('/error')  // Redirigir en caso de error
        }
    }

    return (
        <section className="w-screen h-screen flex items-center justify-center">
            <form className="p-10 rounded-md flex flex-col items-center gap-4 max-w-md">
                <label className="font-nyght text-2xl">Log in</label>

                <Button onClick={handleGoogleLogin} className="w-full" variant="secondary">
                    <div className="flex items-center justify-center gap-2">
                        <Google />
                        <span className="text-darkgray font-bold">Continue With Google</span>
                    </div>
                </Button>

                <Button onClick={handleXLogin} className="w-full" variant="secondary">
                    <div className="flex items-center justify-center gap-2">
                        <X />
                        <span className="text-darkgray font-bold">Continue With X</span>
                    </div>
                </Button>

                <span className="text-xs font-roboto text-center">
                    By entering, I accept CWF <Link href={"/terms"}>Terms & Conditions</Link> of Use and <Link href={"/privacy"}>Privacy Policy</Link>
                </span>
            </form>
        </section>
    )
}
