// Twitter Login
import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST() {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
    })

    if (error) {
        console.log("ERROR", error)
        return NextResponse.redirect('/auth/login')
    } else {
        console.log(data)

        // Si el usuario no esta registrado, entralo a la base de datos

        NextResponse.redirect('/')
    }
}