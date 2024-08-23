import React, { useState, useEffect } from "react"
import { ArrowLeft, ArrowRight } from "@/modules/icons"
import { convertOpeningHoursToDict, convertTo24HourFormat, generateAvailableTimes } from "@/utils/calendar-utils"
import Button from "./button"

const Calendar = ({ handleSelectDate, openingHours }) => {
    const opening_hours = convertOpeningHoursToDict(openingHours)

    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedTime, setSelectedTime] = useState("")
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
    const [availableTimes, setAvailableTimes] = useState([])

    const daysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate()
    }

    const getDayOfWeek = (date) => {
        return new Date(date).toLocaleString("en-US", { weekday: "long" })
    }

    const handleDateClick = (day) => {
        const date = new Date(currentYear, currentMonth, day)
        setSelectedDate(date)
    }

    const handlePrevMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11)
            setCurrentYear(currentYear - 1)
        } else {
            setCurrentMonth(currentMonth - 1)
        }
    }

    const handleNextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0)
            setCurrentYear(currentYear + 1)
        } else {
            setCurrentMonth(currentMonth + 1)
        }
    }

    const handleTimeChange = (e) => {
        setSelectedTime(e.target.value)
    }

    const renderDays = () => {
        const days = []
        const daysInCurrentMonth = daysInMonth(currentMonth, currentYear)
        const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay()

        for (let i = 0; i < firstDayIndex; i++) {
            days.push(<div key={`empty-${i}`} className="w-full"></div>)
        }

        for (let day = 1; day <= daysInCurrentMonth; day++) {
            const isSelected = selectedDate?.getDate() === day &&
                selectedDate?.getMonth() === currentMonth &&
                selectedDate?.getFullYear() === currentYear

            days.push(
                <button
                    key={day}
                    className={`w-full p-2 flex items-center justify-center rounded-lg cursor-pointer
                        ${isSelected ? "bg-brand text-white" : "bg-white text-gray hover:bg-lightbrand hover:border-brand hover:text-brand"}
                        border border-gray-300`}
                    onClick={() => handleDateClick(day)}
                >
                    {day}
                </button>
            )
        }

        return days
    }


    useEffect(() => {
        if (selectedDate) {
            const dayOfWeek = getDayOfWeek(selectedDate)
            const hours = opening_hours[dayOfWeek]

            if (hours) {
                try {
                    // Divide las horas y convierte a formato de 24 horas
                    const [openTime, closeTime] = hours.split(" – ").map(time => convertTo24HourFormat(time.trim()))

                    // Generar la lista de tiempos
                    const times = generateAvailableTimes(openTime, closeTime)
                    setAvailableTimes(times)
                } catch (error) {
                    console.error('Error processing hours:', error.message)
                    setAvailableTimes([])
                }
            } else {
                setAvailableTimes([])  // Closed on this day
            }
        }
    }, [selectedDate, opening_hours])

    return (
        <div className="p-4 rounded-lg bg-white shadow-lg max-w-lg w-full mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={handlePrevMonth}
                    className="bg-lightgray hover:bg-white p-2 rounded-lg"
                >
                    <ArrowLeft />
                </button>
                <span className="text-lg font-semibold">
                    {new Date(currentYear, currentMonth).toLocaleString("default", {
                        month: "long",
                        year: "numeric",
                    })}
                </span>
                <button
                    onClick={handleNextMonth}
                    className="bg-lightgray hover:bg-white p-2 rounded-lg"
                >
                    <ArrowRight />
                </button>
            </div>

            {/* Days of the Week */}
            <div className="grid grid-cols-7 text-center mb-2 font-nyght">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
            </div>

            {/* Days */}
            <div className="grid grid-cols-7 gap-2">
                {renderDays()}
            </div>

            {/* Time Selection */}
            {selectedDate && (
                <div className="mt-4">
                    <label htmlFor="time" className="block mb-2">
                        Select Time:
                    </label>
                    <select
                        id="time"
                        value={selectedTime}
                        onChange={handleTimeChange}
                        className="w-full p-2 border border-gray rounded-lg bg-white text-gray focus:outline-none focus:border-brand cursor-pointer"
                    >
                        <option value="" disabled>Select a time</option>
                        {availableTimes.map((time, index) => (
                            <option key={index} value={time}>
                                {time}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Selected Date and Time */}
            {selectedDate && selectedTime && (
                <div className="w-full mt-4">
                    {/* <p>
                        Selected Date: {selectedDate.toLocaleDateString()}
                    </p>
                    <p>
                        Selected Time: {selectedTime}
                    </p> */}
                    <Button
                        className="w-full"
                        onClick={(event) => handleSelectDate(event, selectedDate, selectedTime)}
                    >
                        Confirm
                    </Button>
                </div>
            )}

        </div>
    )
}

export default Calendar
