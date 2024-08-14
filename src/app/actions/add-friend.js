// actions/add-friend.js
"use server"

import { createClient } from "@/utils/supabase/server"

export default async function addFriend({ recipient_id }) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
        throw new Error("User not authenticated")
    }

    const sender_id = session.user.id

    // Evitar duplicados
    const { data: existingFriendship } = await supabase
        .from('friends')
        .select('*')
        .or(`and(user_id.eq.${sender_id}, friend_id.eq.${recipient_id}),and(user_id.eq.${recipient_id}, friend_id.eq.${sender_id})`);

    if (existingFriendship.length > 0) {
        return { status: 'error', message: 'Friendship already exists or request already sent' }
    }

    // Insertar amistad pendiente
    const { error } = await supabase
        .from('friends')
        .insert([
            { user_id: sender_id, friend_id: recipient_id },
        ])

    if (error) {
        return { status: 'error', message: error.message }
    }

    // Insertar notificación de amistad
    const { data: notiData, error: notiError } = await supabase
        .from('notifications')
        .insert([
            { recipient_id, sender_id, type: 'friend_request' },
        ])

    if (notiError) {
        return { status: 'error', message: notiError.message }
    }

    return { status: 'success', message: 'Friend request sent' }
}
