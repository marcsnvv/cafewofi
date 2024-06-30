import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import HomePage from "@/modules/home"

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)

  const name = user[0]?.name
  const avatar = user[0]?.avatar_url

  return (
    <HomePage name={name} avatar={avatar} />
  )
}
