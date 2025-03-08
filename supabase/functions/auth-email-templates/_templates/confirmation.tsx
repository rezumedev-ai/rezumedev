
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Img,
  Button,
  Hr,
  Section,
} from 'npm:@react-email/components@0.0.11'
import * as React from 'npm:react@18.2.0'

interface ConfirmationEmailProps {
  serverUrl: string
  confirmLink: string
  brandName?: string
  brandColor?: string
}

export const ConfirmationEmail = ({
  serverUrl,
  confirmLink,
  brandName = "Resume Builder",
  brandColor = "#6366F1",
}: ConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Confirm your email for {brandName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://xqkzmcudulutohnskcwt.supabase.co/storage/v1/object/public/emails/logo-email.png"
          width="150"
          height="48"
          alt={brandName}
          style={logo}
        />
        <Heading style={h1}>Confirm your email address</Heading>
        <Text style={paragraph}>
          Thanks for signing up for {brandName}! Please confirm your email address by clicking the button below.
        </Text>
        <Section style={buttonContainer}>
          <Button style={button} href={confirmLink}>
            Confirm Email
          </Button>
        </Section>
        <Text style={paragraph}>
          Or copy and paste this link into your browser:
        </Text>
        <Text style={link}>{confirmLink}</Text>
        <Hr style={hr} />
        <Text style={footer}>
          If you didn't create an account with {brandName}, you can safely ignore this email.
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ConfirmationEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  padding: '30px 0',
}

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #eee',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
  margin: '0 auto',
  maxWidth: '520px',
  padding: '40px',
}

const logo = {
  margin: '0 auto 32px',
  display: 'block',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.25',
  marginBottom: '24px',
  textAlign: 'center' as const,
}

const paragraph = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '24px',
  marginBottom: '16px',
  textAlign: 'center' as const,
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '24px 0',
}

const button = {
  backgroundColor: '#6366F1',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '14px',
  fontWeight: '600',
  padding: '12px 24px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
}

const link = {
  color: '#6366F1',
  fontSize: '14px',
  lineHeight: '24px',
  marginBottom: '24px',
  textAlign: 'center' as const,
  wordBreak: 'break-all' as const,
}

const hr = {
  borderColor: '#eaeaea',
  margin: '26px 0',
}

const footer = {
  color: '#999',
  fontSize: '12px',
  lineHeight: '24px',
  textAlign: 'center' as const,
}
