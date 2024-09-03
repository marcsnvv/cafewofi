"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { Resend } from "resend"
import ReviewEmail from "@/emails/review"

// Inicializar Resend con tu clave API
const resend = new Resend(process.env.RESEND_API_KEY)

export async function WriteReviewAction(formData) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
        console.log("There is no session to like this cafe :/")
        return { error: true, message: "no session" }
    }

    const content = formData.get("content")
    const cafeId = formData.get("cafe_id")
    const cafeSlug = formData.get("slug_url")
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

        // Obtener información del café
        const { data: cafeData } = await supabase
            .from('cafes')
            .select('name')
            .eq('cafe_id', cafeId)
            .single()

        // Enviar correo de confirmación de reseña
        await resend.emails.send({
            from: 'Cafewofi <no-reply@cafewofi.com>',
            to: session.user.email,
            subject: 'Thank you for your review!',
            react: ReviewEmail({
                username: session.user.user_metadata.name,
                cafeName: cafeData.name,
                content: content,
                rating: rating,
            }),
        })

        console.log('Review inserted successfully:', reviewData)
        revalidatePath("/cafe")
        redirect("/cafe/" + cafeSlug)
    } catch (error) {
        console.error('Error inserting review:', error.message)
        throw error
    }
}
