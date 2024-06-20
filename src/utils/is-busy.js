export function isBusyToday(dataString) {
    // Obtener el día actual de la semana (0 para domingo, 1 para lunes, ..., 6 para sábado)
    const currentDate = new Date();
    const currentDay = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)

    // Convertir el string de datos en un objeto para facilitar el acceso
    const data = {};
    const parts = dataString.split(', ');

    // Recorrer cada parte del string para extraer y almacenar los datos
    parts.forEach(part => {
        const [day, ...entries] = part.split(': ');
        const dayName = day.trim().toLowerCase();
        data[dayName] = entries.map(entry => {
            const [hour, percentage] = entry.split(' ');
            return { hour: parseInt(hour), percentage: parseInt(percentage) };
        });
    });

    // Obtener el nombre del día actual en inglés (para el ejemplo dado)
    const dayNames = ['sundays', 'mondays', 'tuesdays', 'wednesdays', 'thursdays', 'fridays', 'saturdays'];
    const currentDayName = dayNames[currentDay];

    // Obtener los datos de afluencia para el día actual
    const todayData = data[currentDayName];

    if (!todayData) {
        throw new Error(`No data found for ${currentDayName}.`);
    }

    // Obtener la hora actual en formato HH (sin minutos)
    const currentHour = currentDate.getHours();

    // Buscar la entrada correspondiente a la hora actual
    let currentHourData = todayData.find(entry => entry.hour === currentHour);

    // Si no se encuentra la entrada exacta para la hora actual,
    // buscar la entrada más cercana anterior
    if (!currentHourData) {
        const previousHourData = [...todayData].reverse().find(entry => entry.hour < currentHour);

        if (!previousHourData) {
            throw new Error(`No data found for the current hour (${currentHour}).`);
        }

        // Usar los datos del hora anterior
        currentHourData = previousHourData;
    }

    // Definir un umbral para determinar si el día es concurrido o no
    const busyThreshold = 70; // Porcentaje de afluencia para considerar que es un día concurrido

    // Comparar el porcentaje actual con el umbral
    if (currentHourData.percentage >= busyThreshold) {
        return true; // Día concurrido
    } else {
        return false; // Día no concurrido
    }
}