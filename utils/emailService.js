import nodemailer from 'nodemailer'

// Create transporter
const createTransporter = () => {
  // Check if email credentials are configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email credentials not configured. Please set EMAIL_USER and EMAIL_PASS in .env file')
    throw new Error('Email credentials not configured')
  }

  if (process.env.EMAIL_USER === 'your-email@gmail.com' || process.env.EMAIL_PASS === 'your-app-password') {
    console.error('❌ Please update EMAIL_USER and EMAIL_PASS with real credentials in .env file')
    throw new Error('Please configure real email credentials')
  }

  console.log('📧 Creating email transporter with user:', process.env.EMAIL_USER)
  
  return nodemailer.createTransport({
    service: 'gmail', // You can change this to your preferred email service
    auth: {
      user: process.env.EMAIL_USER, // Your email
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  })
}

// Send event registration confirmation email
export const sendRegistrationConfirmationEmail = async (userEmail, userName, eventDetails) => {
  try {
    console.log('📧 Attempting to send registration confirmation email to:', userEmail)
    console.log('📧 User:', userName)
    console.log('📧 Event:', eventDetails.name)
    
    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Registration Confirmed - ${eventDetails.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #3B82F6; margin: 0; font-size: 28px; font-weight: bold;">🎉 EventHub</h1>
              <p style="color: #6B7280; margin: 10px 0 0 0;">Event Management Platform</p>
            </div>

            <!-- Main Content -->
            <div style="text-align: center; margin-bottom: 30px;">
              <h2 style="color: #1F2937; margin: 0 0 20px 0; font-size: 24px;">Registration Confirmed!</h2>
              <p style="color: #4B5563; font-size: 18px; margin: 0;">
                Hey <strong>${userName}</strong>! 🎊
              </p>
              <p style="color: #4B5563; font-size: 16px; margin: 15px 0;">
                Congratulations on joining this amazing event! We're excited to have you on board.
              </p>
            </div>

            <!-- Event Details Card -->
            <div style="background-color: #F3F4F6; border-radius: 8px; padding: 25px; margin-bottom: 30px; border-left: 4px solid #3B82F6;">
              <h3 style="color: #1F2937; margin: 0 0 15px 0; font-size: 20px;">📅 Event Details</h3>
              <div style="margin-bottom: 10px;">
                <strong style="color: #374151;">Event:</strong> 
                <span style="color: #6B7280;">${eventDetails.name}</span>
              </div>
              <div style="margin-bottom: 10px;">
                <strong style="color: #374151;">Date:</strong> 
                <span style="color: #6B7280;">${new Date(eventDetails.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div style="margin-bottom: 10px;">
                <strong style="color: #374151;">Time:</strong> 
                <span style="color: #6B7280;">${eventDetails.time}</span>
              </div>
              <div style="margin-bottom: 10px;">
                <strong style="color: #374151;">Location:</strong> 
                <span style="color: #6B7280;">${eventDetails.location}</span>
              </div>
              <div style="margin-bottom: 0;">
                <strong style="color: #374151;">Organizer:</strong> 
                <span style="color: #6B7280;">${eventDetails.organizer}</span>
              </div>
            </div>

            <!-- Important Information -->
            <div style="background-color: #FEF3C7; border-radius: 8px; padding: 20px; margin-bottom: 30px; border-left: 4px solid #F59E0B;">
              <h4 style="color: #92400E; margin: 0 0 10px 0; font-size: 16px;">📢 Important Information</h4>
              <ul style="color: #B45309; margin: 0; padding-left: 20px; font-size: 14px;">
                <li style="margin-bottom: 5px;">All event updates will be sent to this email address</li>
                <li style="margin-bottom: 5px;">Please arrive 15 minutes before the event starts</li>
                <li style="margin-bottom: 5px;">Bring a valid ID for verification</li>
                <li>If you need to cancel, please do so at least 24 hours in advance</li>
              </ul>
            </div>

            <!-- Call to Action -->
            <div style="text-align: center; margin-bottom: 30px;">
              <p style="color: #6B7280; margin: 0 0 20px 0;">
                Want to manage your registrations or explore more events?
              </p>
              <a href="${process.env.FRONTEND_URL}/dashboard" 
                 style="background-color: #3B82F6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                View My Dashboard
              </a>
            </div>

            <!-- Footer -->
            <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; text-align: center;">
              <p style="color: #9CA3AF; margin: 0; font-size: 14px;">
                This email was sent to you because you registered for an event on EventHub.<br>
                If you have any questions, please contact us at 
                <a href="mailto:support@eventhub.com" style="color: #3B82F6;">support@eventhub.com</a>
              </p>
              <p style="color: #9CA3AF; margin: 10px 0 0 0; font-size: 12px;">
                © 2025 EventHub. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      `,
      // Plain text version as fallback
      text: `
        Hey ${userName}!
        
        Congratulations on joining ${eventDetails.name}!
        
        Event Details:
        - Event: ${eventDetails.name}
        - Date: ${new Date(eventDetails.date).toLocaleDateString()}
        - Time: ${eventDetails.time}
        - Location: ${eventDetails.location}
        - Organizer: ${eventDetails.organizer}
        
        All event updates will be sent to this email address.
        
        Visit your dashboard: ${process.env.FRONTEND_URL}/dashboard
        
        Thank you!
        EventHub Team
      `
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('✅ Registration confirmation email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Error sending registration confirmation email:', error.message)
    console.error('📧 Full error:', error)
    return { success: false, error: error.message }
  }
}

// Send general notification email
export const sendNotificationEmail = async (userEmail, userName, subject, message) => {
  try {
    const transporter = createTransporter()

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Hello ${userName}!</h2>
          <p>${message}</p>
          <br>
          <p>Best regards,<br>EventHub Team</p>
        </div>
      `,
      text: `Hello ${userName}!\n\n${message}\n\nBest regards,\nEventHub Team`
    }

    const info = await transporter.sendMail(mailOptions)
    console.log('Notification email sent:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('Error sending notification email:', error)
    return { success: false, error: error.message }
  }
}