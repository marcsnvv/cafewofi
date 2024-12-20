"use client";

import Link from "next/link";
import { createClient } from '@/utils/supabase/client';  // Actualizado para componentes de cliente
import { Close, Email, Google, X } from "@/modules/icons";
import Button from "@/components/button";

export default function SignInWithOAuth({ closeModal, changeToSignInWithEmail }) {
    const supabase = createClient();  // Usa la nueva lógica de cliente

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({ provider: "google" });
        if (error) {
            console.log(error);
            redirect('/error');  // Redirigir en caso de error
        }
    };

    const handleXLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({ provider: "twitter" });
        if (error) {
            console.log(error);
            redirect('/error');  // Redirigir en caso de error
        }
    };

    return (
        <form className="p-10 rounded-md flex flex-col items-center gap-4">
            <label className="font-nyght text-2xl">Log in</label>
            {/* <span>Don’t have an account?
                <Link href="/auth/sign-up">
                    <span className="font-bold">Register</span>
                </Link>
            </span> */}
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

            {/* <Button onClick={changeToSignInWithEmail} className="w-full" variant="secondary">
                <div className="flex items-center justify-center gap-2">
                    <Email size="24" />
                    <span className="text-darkgray font-bold">Continue With Email</span>
                </div>
            </Button> */}

            <span className="text-xs font-roboto text-center">
                By entering, I accept CWF <Link href={"/terms"}>Terms & Conditions</Link> of Use and <Link href={"/privacy"}>Privacy Policy</Link>
            </span>
        </form>
    );
}
