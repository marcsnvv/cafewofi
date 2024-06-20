"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export default async function SignOutAction() {
    const supabase = createServerActionClient({ cookies })
    await supabase.auth.signOut()
    // Refresh the page to remove the cookie sin usar window
    return {
        redirect: {
            destination: "/",
            permanent: false,
        },
    }
}
