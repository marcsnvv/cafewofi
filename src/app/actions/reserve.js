// actions/reserve.js
"use server"

import { createClient } from "@/utils/supabase/server"
import { Resend } from 'resend'
import ReservationEmail from "@/emails/reservation"

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function Reserve({ userId, cafeId, reservationDate, reservationTime }) {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()

    // Verificar si ya hay una reserva para el mismo usuario, café, fecha y hora
    const { data: existingReservation } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_id', userId)
        .eq('cafe_id', cafeId)
        .eq('reservation_date', reservationDate)
        .eq('reservation_time', reservationTime)
        .single()

    if (existingReservation) {
        return { status: "error", message: 'Reservation already exists for this time.' }
    }

    // Insertar la nueva reserva
    const { data, error } = await supabase
        .from('reservations')
        .insert([
            {
                user_id: userId,
                cafe_id: cafeId,
                reservation_date: reservationDate,
                reservation_time: reservationTime
            }
        ])

    if (error) {
        return { status: "error", message: 'Error making the reservation.' }
    }

    const { data: cafe } = await supabase
        .from('cafes')
        .select('name')
        .eq('cafe_id', cafeId)
        .single()

    // Enviar el correo de confirmación de la reserva
    try {
        await resend.emails.send({
            from: 'Cafewofi <no-reply@cafewofi.com>', // Cambia esto al correo desde el cual quieres enviar
            to: session.user.email,
            subject: `Reservation Confirmation for ${cafe.name}`,
            react: ReservationEmail({ username: session.user.user_metadata.name, cafeName: cafe.name, reservationDate, reservationTime }),
        })
    } catch (emailError) {
        console.error("Error sending email:", emailError)
        return { status: "error", message: 'Reservation made, but failed to send confirmation email.' }
    }

    return { status: "success", message: data }
}
