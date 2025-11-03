#!/usr/bin/env node

import readline from 'readline'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(query) {
  return new Promise(resolve => rl.question(query, resolve))
}

async function setupEmail() {
  console.log('\n📧 EventHub Email Configuration Setup\n')
  console.log('This will help you configure email settings for registration confirmations.\n')
  
  try {
    const emailUser = await question('Enter your Gmail address: ')
    
    console.log('\n🔐 For Gmail, you need an App Password (not your regular password):')
    console.log('1. Enable 2-Factor Authentication on your Gmail')
    console.log('2. Go to Google Account → Security → App passwords')
    console.log('3. Generate a new app password for "Mail"')
    console.log('4. Use that 16-character password below\n')
    
    const emailPass = await question('Enter your Gmail App Password: ')
    
    // Read current .env file
    const envPath = path.join(__dirname, '.env')
    let envContent = ''
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8')
    }
    
    // Update email settings
    envContent = envContent.replace(/EMAIL_USER=.*/, `EMAIL_USER=${emailUser}`)
    envContent = envContent.replace(/EMAIL_PASS=.*/, `EMAIL_PASS=${emailPass}`)
    
    // If EMAIL_USER or EMAIL_PASS don't exist, add them
    if (!envContent.includes('EMAIL_USER=')) {
      envContent += `\nEMAIL_USER=${emailUser}`
    }
    if (!envContent.includes('EMAIL_PASS=')) {
      envContent += `\nEMAIL_PASS=${emailPass}`
    }
    if (!envContent.includes('FRONTEND_URL=')) {
      envContent += `\nFRONTEND_URL=http://localhost:5173`
    }
    
    // Write back to .env
    fs.writeFileSync(envPath, envContent)
    
    console.log('\n✅ Email configuration saved to .env file!')
    console.log('🔄 Please restart your backend server for changes to take effect.')
    console.log('\n📧 Test the email functionality by registering for an event.')
    
  } catch (error) {
    console.error('❌ Error setting up email:', error.message)
  } finally {
    rl.close()
  }
}

setupEmail()