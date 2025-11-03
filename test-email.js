#!/usr/bin/env node

import dotenv from 'dotenv'
import { sendRegistrationConfirmationEmail } from './utils/emailService.js'

// Load environment variables
dotenv.config()

async function testEmail() {
  console.log('\n📧 Testing Email Configuration...\n')
  
  // Check if credentials are set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('❌ Email credentials not found in .env file')
    console.log('Please run: node setup-email.js')
    return
  }
  
  if (process.env.EMAIL_USER === 'your-email@gmail.com') {
    console.error('❌ Please configure real email credentials')
    console.log('Run: node setup-email.js')
    return
  }
  
  console.log('📧 Configured email:', process.env.EMAIL_USER)
  console.log('🔄 Sending test email...\n')
  
  try {
    const result = await sendRegistrationConfirmationEmail(
      process.env.EMAIL_USER, // Send to the same email for testing
      'Test User',
      {
        name: 'Test Event - Email Configuration',
        date: new Date(),
        time: '10:00 AM',
        location: 'Test Location',
        organizer: 'EventHub Team'
      }
    )
    
    if (result.success) {
      console.log('✅ Test email sent successfully!')
      console.log('📬 Check your inbox for the confirmation email.')
      console.log('📧 Message ID:', result.messageId)
    } else {
      console.error('❌ Failed to send test email:', result.error)
    }
    
  } catch (error) {
    console.error('❌ Error testing email:', error.message)
  }
}

testEmail()