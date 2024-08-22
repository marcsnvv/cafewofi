"use client"

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'


import Calendar from './calendar'
import Popup from './popup'
import Button from './button'
import Reserve from '@/app/actions/reserve'
import confetti from 'canvas-confetti'

const ReserveButton = ({ cafeName, cafeId, userId }) => {
    const supabase = createClient()

    const [showCalendar, setShowCalendar] = useState(false)
    const [showConfirmPopup, setShowConfirmPopup] = useState(false)
    const [selectedDateTime, setSelectedDateTime] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [buttonText, setButtonText] = useState("I'm going")
    const [buttonDisabled, setButtonDisabled] = useState(false)

    const [title, setTitle] = useState(<>Do you want to confirm your reservation @ <span className="font-nyght">{cafeName}</span> ?</>)

    function handleDateSelect(date) {
        setSelectedDateTime(date)
        setShowCalendar(false)
        setShowConfirmPopup(true)
    }

    function handleShowCalendar(e) {
        e.preventDefault()
        setShowCalendar(!showCalendar)
    }

    async function checkReservation(userId, date) {
        // Implementa una función que verifique si ya existe una reserva para el usuario en esa fecha
        const { data, error } = await supabase
            .from("reservations")
            .select("reservation_date")
            .eq("user_id", userId)

        if (error) {
            console.log(error)
        }

        let hasReservation = false
        data.forEach(reserv => {
            if (reserv.reservation_date === date) {
                hasReservation = true
            }
        })

        return hasReservation
    }

    function handleClosePopup() {
        setShowConfirmPopup(false)
        setButtonText("I'm going")
        setTitle(<>Do you want to confirm your reservation @ <span className="font-nyght">{cafeName}</span> ?</>)
    }

    async function handleSubmit(e) {
        e.preventDefault() // Prevent default form submission
        setButtonDisabled(true)

        // Verificar si ya hay una reserva en ese día
        const hasReservation = await checkReservation(userId, selectedDateTime);

        if (hasReservation) {
            setErrorMessage("You already have a reservation on this date.")
            setButtonDisabled(false)
            return
        }

        setErrorMessage('')

        // Cambiar el texto del botón y manejar la reserva
        setButtonText('Reserving...')
        Reserve({
            userId,
            cafeId,
            reservationDate: selectedDateTime.toISOString().split('T')[0],
            reservationTime: selectedDateTime.toTimeString().split(' ')[0]
        })

        // Mostrar confeti
        setTimeout(() => {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            })
            setButtonText('Reserved')
            setTitle(<>Reserved! We have sent you an email with more information, check it out!</>)

            // Esperar 5 segundos antes de cambiar el texto a "Cerrar"
            setTimeout(() => {
                setButtonText('Close')
                setButtonDisabled(false)
            }, 5000)
        }, 2000)
    }

    return (
        <>

            {showCalendar ?
                <Calendar onDateSelect={handleDateSelect} /> :
                (
                    <Button
                        className="px-10 font-bold text-lg lg:text-base"
                        onClick={(e) => handleShowCalendar(e)}
                    >
                        I'm going
                    </Button>
                )}
            {showConfirmPopup &&
                <Popup
                    opened={showConfirmPopup}
                    content={
                        <div className="p-12 flex flex-col gap-5">
                            <h4 className="font-semibold text-xl">
                                {title}
                            </h4>
                            <form className="flex flex-col justify-start gap-5">
                                <input name="userId" className="hidden" value={userId} readOnly></input>
                                <input name="cafeId" className="hidden" value={cafeId} readOnly></input>
                                <input name="reservationDate" className="hidden" value={selectedDateTime.toISOString().split('T')[0]} readOnly></input>
                                <input name="reservationTime" className="hidden" value={selectedDateTime.toTimeString().split(' ')[0]} readOnly></input>
                                {buttonText === "I'm going" && (
                                    <div className="flex flex-col gap-3">
                                        <span>Date: {selectedDateTime.toISOString().split('T')[0]}</span>
                                        <span>Time: {selectedDateTime.toTimeString().split(' ')[0]}</span>
                                    </div>
                                )}
                                <Button
                                    type="button" // Prevent default submit behavior
                                    onClick={buttonText === "Close" ? handleClosePopup : handleSubmit}
                                    disabled={buttonDisabled}
                                >
                                    {buttonText}
                                </Button>
                                {errorMessage && <span className="text-red-500 text-sm">{errorMessage}</span>}
                            </form>
                        </div>
                    }
                />
            }
        </>
    )
}

export default ReserveButton
