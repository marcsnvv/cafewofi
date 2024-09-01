import { Html, Head, Body, Container, Heading, Text, Button } from "@react-email/components"

export default function FriendRequestEmail({ recipientName, senderName }) {
    return (
        <Html>
            <Head />
            <Body style={mainStyle}>
                <Container style={containerStyle}>
                    <Heading style={headingStyle}>New Friend Request!</Heading>
                    <Text style={textStyle}>Hi {recipientName},</Text>
                    <Text style={textStyle}>
                        {senderName} has sent you a friend request on Cafewofi.
                    </Text>
                    <Text style={textStyle}>
                        To accept or decline this request, please visit your notifications page.
                    </Text>

                    <Button
                        href="https://cafewofi.com/notifications"  // Actualiza con la URL de tu app
                        style={buttonStyle}
                    >
                        View Friend Request
                    </Button>

                    <Text style={textStyle}>Thank you for being a part of Cafewofi!</Text>
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

// Styles
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
