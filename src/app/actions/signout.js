"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

export default async function SignOutAction() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    // Refresh the page to remove the cookie sin usar window
    if (error) {
        console.error(error)
    }
    revalidatePath('/', 'layout')
    redirect("/account")
}
