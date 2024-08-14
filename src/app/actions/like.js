"use server"

import { createClient } from "@/utils/supabase/client"

export async function LikeAction(postId) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    try {
        // Intenta insertar un nuevo like en la tabla 'Likes'
        const { data: likeData, error } = await supabase
            .from('likes')
            .insert([
                {
                    user_id: session.user.id,
                    cafe_id: postId.get("postId"),
                },
            ])
            .eq("user_id", session.user.id)

        if (error) {
            throw error;
        }

        console.log('Like inserted successfully:', likeData);
    } catch (error) {
        console.error('Error inserting like:', error.message);
        throw error;
    }
}