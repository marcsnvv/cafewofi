import { createClient } from "@/utils/supabase/server"
import HomePage from "@/modules/home"

export default async function Home() {
  const supabase = createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", session?.user?.id)

  const name = user?.[0].name
  const avatar_url = user?.[0].avatar_url

  return (
    <HomePage name={name} avatar_url={avatar_url} />
  )
}
