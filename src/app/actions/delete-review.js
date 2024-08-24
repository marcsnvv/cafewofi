"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function DeleteReviewAction(reviewId, userId) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        console.log("There is no session to like this cafe :/")
        return
    }

    try {
        const { data: reviewData, error } = await supabase
            .from('reviews')
            .delete()
            .eq("id", reviewId)
            .eq("author_id", userId)

        if (error) {
            throw error
        }

        console.log("REVIEW ID", reviewId)
        console.log("USER ID", userId)

        console.log('Review removed successfully:', reviewData)
    } catch (error) {
        console.error('Error removing review:', error.message)
        throw error
    }
}
