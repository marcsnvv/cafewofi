export const generateAvailableTimes = (openTime, closeTime) => {
    const times = [];
    let currentTime = new Date(`1970-01-01T${openTime}:00`);
    let endTime = new Date(`1970-01-01T${closeTime}:00`);

    // Si la hora de cierre es menor que la hora de apertura, significa que el rango abarca la medianoche
    if (endTime < currentTime) {
        endTime.setDate(endTime.getDate() + 1); // Ajustar al día siguiente
    }

    while (currentTime <= endTime) {
        times.push(currentTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        }));
        currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return times;
};

export const convertTo24HourFormat = (timeStr) => {
    if (!timeStr || typeof timeStr !== 'string') {
        throw new Error(`Invalid time string: ${timeStr}`);
    }

    const [time, modifier] = timeStr.split(" ");

    if (!time || !modifier) {
        throw new Error(`Invalid time format: ${timeStr}`);
    }

    let [hours, minutes] = time.split(":");

    hours = hours || '00';
    minutes = minutes || '00';

    if (modifier === "PM" && hours !== "12") {
        hours = String(parseInt(hours, 10) + 12);
    } else if (modifier === "AM" && hours === "12") {
        hours = "00";
    }

    hours = hours.padStart(2, '0');
    minutes = minutes.padStart(2, '0');

    return `${hours}:${minutes}`
}

export const convertOpeningHoursToDict = (openingHoursString) => {
    // console.log(openingHoursString)
    // Verifica si la entrada es una cadena válida
    if (typeof openingHoursString !== 'string') {
        console.error('Invalid opening hours string');
        return {};
    }

    // Define el orden de los días de la semana
    const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];

    // Limpiar el string para reemplazar caracteres especiales no estándar
    const cleanedString = openingHoursString.replace(/\u202F/g, ' ').trim();

    // Dividir el string por comas para separar cada día
    const daysArray = cleanedString.split(", ");

    const openingHoursDict = {};

    // Procesar cada día y su horario
    daysArray.forEach((dayString) => {
        const [day, hours] = dayString.split(": ");
        if (day && hours) {
            // Utiliza el día en inglés para llenar el dict
            const dayIndex = daysOfWeek.indexOf(day.split(" ")[0]);
            if (dayIndex !== -1) {
                openingHoursDict[daysOfWeek[dayIndex]] = hours.trim();
            }
        }
    });

    // console.log(openingHoursDict)

    return openingHoursDict;
};