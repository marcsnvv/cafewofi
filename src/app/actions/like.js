"use server"

import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function LikeAction(postId) {
    const supabase = createServerActionClient({ cookies })
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