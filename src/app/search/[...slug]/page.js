import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

import Finder from "@/modules/finder"

export default async function Search({ params }) {
    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    if (error || !session.user) {
        redirect('/')
    }

    let { data: user, } = await supabase
        .from("users")
        .select("avatar_url, name")
        .eq("id", session.user.id)

    let { data: likes } = await supabase
        .from("likes")
        .select("cafe_id")
        .eq("user_id", session.user.id)

    let { data: cafes } = await supabase
        .from('cafes')
        .select('*')

    const name = user[0]?.name
    const avatar_url = user[0]?.avatar_url

    return (
        <main>
            <Finder
                params={params}
                cafes={cafes}
                props={{
                    avatar_url,
                    name,
                    likes
                }}
            />
        </main>
    )
}