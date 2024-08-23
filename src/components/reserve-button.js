"use client"

import React, { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'

import { Laugh, Email } from '@/modules/icons'

import Calendar from './calendar'
import Popup from './popup'
import Button from './button'
import Reserve from '@/app/actions/reserve'
import confetti from 'canvas-confetti'

const ReserveButton = ({ openingHours, cafeName, cafeId, userId }) => {
    const supabase = createClient()

    const [showCalendar, setShowCalendar] = useState(false)
    const [showConfirmPopup, setShowConfirmPopup] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [buttonText, setButtonText] = useState("I'm going")
    const [buttonDisabled, setButtonDisabled] = useState(false)

    const [date, setDate] = useState(null)
    const [time, setTime] = useState(null)

    const [title, setTitle] = useState(<>Do you want to confirm your reservation @ <span className="font-nyght">{cafeName}</span> ?</>)

    function handleDateSelect(event, selectedDate, selectedTime) {
        event.preventDefault()
        setTime(selectedTime)
        setDate(selectedDate)
        setShowCalendar(false)
        setShowConfirmPopup(true)
    }

    function handleShowCalendar(e) {
        e.preventDefault()
        setShowCalendar(!showCalendar)
    }

    async function checkReservation(userId, date) {
        try {
            // Consulta optimizada para verificar directamente si existe una reserva para ese usuario y fecha
            const { data, error } = await supabase
                .from("reservations")
                .select("reservation_date")
                .eq("user_id", userId)
                .eq("reservation_date", date) // Filtrar por fecha

            if (error) {
                throw error; // Arroja el error para que sea manejado externamente
            }

            // Si existe alguna fila, significa que ya hay una reserva en esa fecha
            return data.length > 0;
        } catch (error) {
            console.error("Error checking reservation:", error.message);
            return false; // Retornar false en caso de error, o podrías manejarlo de otra forma
        }
    }

    function handleClosePopup() {
        setShowConfirmPopup(false)
        setButtonText("I'm going")
        setTitle(<>Do you want to confirm your reservation @ <span className="font-nyght">{cafeName}</span> ?</>)
    }

    function formatDate(date) {
        return date ? date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''
    }

    async function handleSubmit(e) {
        e.preventDefault() // Prevent default form submission
        setButtonDisabled(true)

        // Verificar si ya hay una reserva en ese día
        const hasReservation = await checkReservation(userId, date);

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
            reservationDate: date,
            reservationTime: time
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
                <Calendar handleSelectDate={handleDateSelect} openingHours={openingHours} /> :
                (
                    <Button
                        className="w-full px-10 font-bold text-lg lg:text-base"
                        onClick={(e) => handleShowCalendar(e)}
                    >
                        I'm going
                    </Button>
                )}
            {showConfirmPopup &&
                <Popup
                    opened={showConfirmPopup}
                    content={
                        <div className="p-5 flex flex-col gap-5">
                            <h4 className="font-semibold text-xl pr-8">
                                {title}
                            </h4>
                            <form className="flex flex-col justify-start gap-5">
                                <input name="userId" className="hidden" value={userId} readOnly></input>
                                <input name="cafeId" className="hidden" value={cafeId} readOnly></input>
                                <input name="reservationDate" className="hidden" value={date} readOnly></input>
                                <input name="reservationTime" className="hidden" value={time} readOnly></input>
                                {buttonText === "I'm going" && (
                                    <div className="w-full flex justify-between border border-gray rounded-lg">
                                        <div className="flex items-center justify-center border-r border-r-gray p-2">
                                            <span>Date: {formatDate(date)}</span>
                                        </div>
                                        <div className="flex items-start justify-start p-2">
                                            <span>Time: {time}</span>
                                        </div>
                                    </div>
                                )}
                                <span className="text-gray text-sm flex items-center justify-center gap-2">
                                    <Email size="20" color="#6B6F7B" />
                                    We will send a confirmation message to both the cafe and you!
                                </span>
                                <span className="text-gray text-sm flex items-center justify-center gap-2">
                                    <Laugh size="20" />
                                    There will be no additional costs, but remember to leave a tip.
                                </span>
                                <Button
                                    type="button" // Prevent default submit behavior
                                    onClick={buttonText === "Close" ? handleClosePopup : handleSubmit}
                                    disabled={buttonDisabled}
                                >
                                    {buttonText}
                                </Button>
                                {errorMessage && <span className="text-red-500 text-sm">{errorMessage}</span>}
                            </form>
                        </div >
                    }
                />
            }
        </>
    )
}

export default ReserveButton
