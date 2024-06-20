import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

import HomePage from "@/modules/home"

export default async function Home() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()
  const avatar = session?.user?.user_metadata?.avatar_url
  const name = session?.user?.user_metadata?.full_name

  return (
    <HomePage name={name} avatar={avatar} />
  )
}
