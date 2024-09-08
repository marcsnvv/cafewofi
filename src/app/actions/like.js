"use server"

import { createClient } from "@/utils/supabase/server"

// Establecer cantidad de puntos por hacer esta accion
const POINTS_PER_THIS_ACTION = 50 // SOLO LA PRIMERA VEZ

export async function LikeAction(postId) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        console.log("There is no session to like this cafe :/")
        return
    }

    const userId = session.user.id

    try {
        // Verificar si el usuario ya ha dado like a este post
        const { data: existingLike, error: existingLikeError } = await supabase
            .from('likes')
            .select('*')
            .eq("user_id", userId)
            .eq("cafe_id", postId.get("postId"))

        if (existingLikeError) {
            throw existingLikeError
        }

        if (existingLike.length > 0) {
            return { status: 'error', message: 'You have already liked this post' }
        }

        // Insertar nuevo like
        const { data: likeData, error } = await supabase
            .from('likes')
            .insert([
                {
                    user_id: userId,
                    cafe_id: postId.get("postId"),
                },
            ])

        if (error) {
            throw error;
        }

        console.log('Like inserted successfully:', likeData);

        // Verificar si este es el primer like del usuario
        const { data: totalLikes } = await supabase
            .from('likes')
            .select('*')
            .eq('user_id', userId)

        if (totalLikes.length === 1) {  // Si el total de likes es 1, significa que este es el primer like
            // Verificar si el usuario ya tiene una entrada en la tabla de puntos
            const { data: userPoints } = await supabase
                .from('points')
                .select('*')
                .eq('user_id', userId)
                .single()

            if (userPoints) {
                // Actualizar los puntos del usuario
                const { error: updateError } = await supabase
                    .from('points')
                    .update({ total_points: userPoints.total_points + POINTS_PER_THIS_ACTION })
                    .eq('user_id', userId)

                if (updateError) {
                    return { status: 'error', message: updateError.message }
                }
            } else {
                // Crear una nueva entrada en la tabla de puntos para el usuario
                const { error: insertError } = await supabase
                    .from('points')
                    .insert([{ user_id: userId, total_points: POINTS_PER_THIS_ACTION }])

                if (insertError) {
                    return { status: 'error', message: insertError.message }
                }
            }
        }

        return { status: 'success', message: 'Like added and points awarded if this was your first like.' }

    } catch (error) {
        console.error('Error inserting like:', error.message);
        throw error
    }
}
