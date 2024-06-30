import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { redirect } from 'next/navigation'

import Finder from "@/modules/finder"

export default async function Search({ params }) {
    const supabase = createServerComponentClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        redirect("/")
    }

    let { data: user } = await supabase
        .from("users")
        .select("avatar_url, name")
        .eq("id", session.user.id)

    let { data: likes } = await supabase
        .from("likes")
        .select("cafe_id")
        .eq("user_id", session.user.id)

    let { data: cafes, error } = await supabase
        .from('cafes')
        .select('*')

    const name = user[0]?.name
    const avatar = user[0]?.avatar_url


    return (
        <main>
            <Finder
                params={params}
                cafes={cafes}
                props={{
                    avatar,
                    name,
                    likes
                }}
            />
        </main>
    )
}