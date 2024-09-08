"use server"

import { createClient } from "@/utils/supabase/server"

// Establecer cantidad de puntos por hacer esta accion
const POINTS_PER_THIS_ACTION = 50 // SOLO LA PRIMERA VEZ

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
    const { error: notiError } = await supabase
        .from('notifications')
        .insert([
            { recipient_id, sender_id, type: 'friend_request' },
        ])

    if (notiError) {
        return { status: 'error', message: notiError.message }
    }

    // Verificar si este es el primer amigo del usuario
    const { data: totalFriends } = await supabase
        .from('friends')
        .select('*')
        .eq('user_id', sender_id)

    if (totalFriends.length === 1) {  // Si el total de amigos es 1, significa que este es el primer amigo
        // Verificar si el usuario ya tiene una entrada en la tabla de puntos
        const { data: userPoints } = await supabase
            .from('points')
            .select('*')
            .eq('user_id', sender_id)
            .single()

        if (userPoints) {
            // Actualizar los puntos del usuario
            const { error: updateError } = await supabase
                .from('points')
                .update({ total_points: userPoints.total_points + POINTS_PER_THIS_ACTION })
                .eq('user_id', sender_id)

            if (updateError) {
                return { status: 'error', message: updateError.message }
            }
        } else {
            // Crear una nueva entrada en la tabla de puntos para el usuario
            const { error: insertError } = await supabase
                .from('points')
                .insert([{ user_id: sender_id, total_points: POINTS_PER_THIS_ACTION }])

            if (insertError) {
                return { status: 'error', message: insertError.message }
            }
        }
    }

    return { status: 'success', message: 'Friend request sent and points awarded if this was the first friend.' }
}
