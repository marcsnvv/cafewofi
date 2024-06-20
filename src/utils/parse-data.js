// src/utils/parseData.js
export function parseData(dataString) {
    if (!dataString) return [];

    const daysOfWeek = ['sundays', 'mondays', 'tuesdays', 'wednesdays', 'thursdays', 'fridays', 'saturdays'];

    const data = daysOfWeek.map(day => {
        const regex = new RegExp(`${day}: (\\d+ \\d+)`, 'g');
        const matches = dataString.match(regex);

        if (!matches) return { name: day, data: [] };

        const hours = matches.map(match => {
            const [_, hour, value] = match.split(' ');
            return { x: parseInt(hour), y: parseInt(value) };
        });

        // Find the hour with the maximum value
        hours.sort((a, b) => b.y - a.y); // Sort by value descending
        const mostPopularHour = hours.length > 0 ? hours[0] : null;

        return { name: day, data: mostPopularHour ? [mostPopularHour] : [] };
    });

    return data;
}
