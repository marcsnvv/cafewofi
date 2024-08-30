// Twitter Login
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export async function POST() {
    const supabase = createClient()

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'twitter',
    })

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}