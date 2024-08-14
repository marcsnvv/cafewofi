"use server"

import { createClient } from "@/utils/supabase/client"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function WriteReviewAction(formData) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    const content = formData.get("content")
    const cafeId = formData.get("cafe_id")
    const authorId = formData.get("author_id")
    const rating = formData.get("rating")

    try {
        // Realizar validaciones de contenido aquí antes de la inserción
        if (!content || content.trim() === '') {
            throw new Error('Content is required.')
        }

        // Intenta insertar una nueva reseña en la tabla 'reviews'
        const { data: reviewData, error } = await supabase
            .from('reviews')
            .insert([
                {
                    content: content,
                    cafe_id: cafeId,
                    author_id: authorId,
                    rating: rating
                },
            ])

        if (error) {
            throw error
        }

        console.log('Review inserted successfully:', reviewData)
        revalidatePath("/cafe")
        redirect("/cafe/" + cafeId)
    } catch (error) {
        console.error('Error inserting review:', error.message)
        throw error
    }
}
