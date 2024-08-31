import { Html, Head, Body, Container, Heading, Text } from "@react-email/components"

export default function ReviewEmail({ username, cafeName, content, rating }) {
    return (
        <Html>
            <Head />
            <Body style={mainStyle}>
                <Container style={containerStyle}>
                    <Heading style={headingStyle}>Review Submitted</Heading>
                    <Text style={textStyle}>Hi {username},</Text>
                    <Text style={textStyle}>
                        Thank you for submitting your review for {cafeName}!
                    </Text>
                    <Text style={textStyle}>
                        <strong>Rating:</strong> {rating} stars<br />
                        <strong>Your Review:</strong> {content}
                    </Text>

                    <Text style={textStyle}>We appreciate your feedback and will take it into consideration to improve our services.</Text>
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
