// actions/add-friend.js
"use server"

import { createClient } from "@/utils/supabase/server"

export default async function Reserve({ userId, cafeId, reservationDate, reservationTime }) {
    const supabase = createClient()

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

    return { status: "success", message: data }
}
