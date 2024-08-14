"use server"

import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"

export default async function SignOutAction() {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    // Refresh the page to remove the cookie sin usar window
    redirect("/")
}
