import { Html, Head, Body, Container, Heading, Text, Button } from "@react-email/components"

export default function ReservationEmail({ username, cafeName, reservationDate }) {
    // Convertir la fecha al formato 'YYYY-MM-DD' si no está en ese formato
    const formattedDate = formatDateToYYYYMMDD(reservationDate)

    if (!formattedDate) {
        console.error("Invalid date format. Expected 'YYYY-MM-DD'.")
        return null // Manejar el error de alguna manera
    }

    // Crear el enlace del calendario solo con la fecha
    const calendarLink = createCalendarLink({
        title: `Reservation at ${cafeName}`,
        start: formattedDate,
        description: `Your reservation at ${cafeName}`,
        location: cafeName
    })

    console.log("CALENDAR LINK: ", calendarLink)

    return (
        <Html>
            <Head />
            <Body style={mainStyle}>
                <Container style={containerStyle}>
                    <Heading style={headingStyle}>Reservation Confirmation</Heading>
                    <Text style={textStyle}>Hi {username},</Text>
                    <Text style={textStyle}>
                        Your reservation at {cafeName} has been confirmed.
                    </Text>
                    <Text style={textStyle}>
                        <strong>Date:</strong> {formattedDate}
                    </Text>

                    <Button href={calendarLink} style={buttonStyle}>
                        Add this event to your calendar
                    </Button>

                    <Text style={textStyle}>Thank you for choosing our service!</Text>
                    <Text style={footerStyle}>
                        Best regards,<br />
                        Marc<br />
                        CEO of Cafewofi
                    </Text>
                </Container>
            </Body>
        </Html>
    )
}

function formatDateToCustomFormat(dateStr) {
    // Crear un objeto Date a partir del string de entrada
    const date = new Date(dateStr);

    // Obtener las partes de la fecha
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Meses en JavaScript están en base 0
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    // Formatear la fecha en el formato deseado
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

// Función para crear un enlace de calendario
function createCalendarLink({ title, start, description, location }) {
    let formattedDate = formatDateToCustomFormat(start)
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${formattedDate}&details=${description}&location=${location}&text=${title}`
}

// Función para formatear la fecha al formato 'YYYY-MM-DD'
function formatDateToYYYYMMDD(dateString) {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
        return null // Si la fecha no es válida, devolver null
    }

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0') // Mes empieza desde 0
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

// Estilos
const mainStyle = {
    backgroundColor: '#f4f4f4',
    fontFamily: 'Arial, sans-serif',
    padding: '20px',
}

const containerStyle = {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    maxWidth: '600px',
    margin: '0 auto',
}

const headingStyle = {
    color: '#333333',
    fontSize: '24px',
    marginBottom: '20px',
}

const textStyle = {
    color: '#555555',
    fontSize: '16px',
    lineHeight: '1.5',
}

const footerStyle = {
    marginTop: '20px',
    color: '#888888',
    fontSize: '14px',
    lineHeight: '1.5',
}

// Estilo de botones con el color de la marca
const buttonStyle = {
    backgroundColor: '#CC7843', // Color de la marca
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '16px',
    marginTop: '20px',
    display: 'inline-block',
}

// Aplicar el color de la marca a los enlaces
const linkStyle = {
    color: '#CC7843', // Color de la marca
    textDecoration: 'none',
}
