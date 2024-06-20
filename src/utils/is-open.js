export function isOpen(openingHours, language = 'english', currentDate = new Date()) {
    if (!openingHours || typeof openingHours !== 'string') {
        throw new Error('Invalid or missing opening hours string.');
    }

    // Get the current day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
    const currentDay = currentDate.getDay();

    // Define day names arrays for different languages
    const dayNames = {
        english: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        // Add more languages as needed
    };

    // Convert the language parameter to lowercase and get the corresponding day names array
    const daysOfWeek = dayNames[language.toLowerCase()];
    if (!daysOfWeek) {
        throw new Error(`Unsupported language '${language}'.`);
    }

    // Get the name of the current day in lowercase
    const currentDayName = daysOfWeek[currentDay];

    // Construct regex pattern to match opening hours for the current day
    const regex = new RegExp(currentDayName + ' (\\d{1,2}:\\d{2})–(\\d{1,2}:\\d{2})', 'i');
    const match = openingHours.match(regex);

    if (!match) {
        return false; // Opening hours for current day not found
    }

    // Extract opening and closing hours from the match
    const openingTime = match[1];
    const closingTime = match[2];

    // Get current time in HH:mm format
    const currentHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const currentTime = `${currentHour}:${currentMinutes < 10 ? '0' + currentMinutes : currentMinutes}`;

    // Check if current time is within opening hours
    if (currentTime >= openingTime && currentTime <= closingTime) {
        return true; // Open now
    } else {
        return false; // Closed now
    }
}