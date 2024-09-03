import { createClient } from '@/utils/supabase/server'
// import { redirect } from 'next/navigation'
import { incrementSearchCount } from '@/app/actions/increment-search-count'
import Finder from "@/modules/finder"


export default async function Search({ params }) {
    const supabase = createClient()
    const { data: { session }, error } = await supabase.auth.getSession()

    // Llamar a la server action
    // const searchCount = await incrementSearchCount()

    // GET CAFES
    let { data: cafes } = await supabase
        .from('cafes')
        .select('*')

    // GET USER INFO IF IS LOGGED
    let name = ""
    let avatar_url = ""
    let likes = []
    let showLoginPopup = false

    if (error || !session?.user) {
        // if (searchCount >= 5) {
        //     showLoginPopup = true
        // }
    } else {
        let { data: user, } = await supabase
            .from("users")
            .select("avatar_url, name")
            .eq("id", session.user.id)

        let { data: likes } = await supabase
            .from("likes")
            .select("cafe_id")
            .eq("user_id", session.user.id)

        name = user[0]?.name
        avatar_url = user[0]?.avatar_url
    }


    return (
        <main>
            <Finder
                params={params}
                cafes={cafes}
                props={{
                    avatar_url: avatar_url,
                    name: name,
                    likes: likes,
                    showLoginPopup: showLoginPopup
                }}
            />
        </main>
    )
}