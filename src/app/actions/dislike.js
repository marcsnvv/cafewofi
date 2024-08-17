"use server"

import { createClient } from "@/utils/supabase/server"

export async function DislikeAction(postId) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        console.log("There is no session to dislike this cafe :/")
        return
    }

    try {
        // Intenta eliminar un like existente de la tabla 'likes'
        const { data: dislikeData, error } = await supabase
            .from('likes')
            .delete()
            .eq("user_id", session.user.id)
            .eq("cafe_id", postId.get("postId"))

        if (error) {
            throw error;
        }

        console.log('Dislike removed successfully:', dislikeData);
    } catch (error) {
        console.error('Error removing dislike:', error.message);
        throw error;
    }
}
