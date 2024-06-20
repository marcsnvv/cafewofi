export default function ETS(from) {
    const now = new Date();
    const f = new Date(from)
    const difference = now - f;

    // Convert difference from milliseconds to seconds
    const seconds = Math.floor(difference / 1000);

    if (seconds < 60) {
        return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    }

    // Convert to minutes
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    }

    // Convert to hours
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
        return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    }

    // Convert to days
    const days = Math.floor(hours / 24);
    if (days < 30) {
        return `${days} day${days !== 1 ? 's' : ''} ago`;
    }

    // Convert to months
    const months = Math.floor(days / 30);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
}

// Example of usage:
// const publicationDate = new Date('2023-01-01T12:00:00Z');
// console.log(ETS(publicationDate));
