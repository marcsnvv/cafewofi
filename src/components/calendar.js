import React, { useState } from 'react'
import DatePicker from 'react-datepicker'  // Biblioteca de calendario
import 'react-datepicker/dist/react-datepicker.css' // Estilos del calendario

const Calendar = ({ onDateSelect }) => {
    const [startDate, setStartDate] = useState(null)

    const handleDateChange = (date) => {
        setStartDate(date)
        onDateSelect(date)  // Llamada a la función de selección de fecha
    }

    return (
        <div className="calendar-container">
            <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                className="rounded-lg border p-2"
                placeholderText="Select Date and Time"
            />
        </div>
    )
}

export default Calendar
