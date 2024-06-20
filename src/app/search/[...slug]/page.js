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

    const avatar = session?.user?.user_metadata?.avatar_url
    const name = session?.user?.user_metadata?.full_name

    let { data: likes } = await supabase
        .from("likes")
        .select("cafe_id")
        .eq("user_id", session.user.id)

    let { data: cafes, error } = await supabase
        .from('cafes')
        .select('*')


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