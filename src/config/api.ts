/**
 * API Configuration
 * 
 * To enable backend email sending:
 * 1. Replace BACKEND_ENDPOINT with your actual API endpoint
 * 2. Set ENABLE_BACKEND to true
 * 
 * The endpoint should accept POST requests with the following JSON structure:
 * {
 *   name: string,
 *   email: string,
 *   countryOfResidence: string,
 *   countryOfOrigin: string,
 *   preferredCallDate: string (ISO format),
 *   preferredCallTime: string,
 *   timezone: string,
 *   notes: string
 * }
 * 
 * Expected response: { success: boolean, message?: string }
 */

export const API_CONFIG = {
  // Set to true when backend is ready
  ENABLE_BACKEND: false,
  
  // Replace with your backend endpoint URL
  BACKEND_ENDPOINT: 'https://your-domain.com/api/contact',
  
  // Email recipient (for documentation purposes)
  RECIPIENT_EMAIL: 'daniel.whiting@holbornassets.com'
} as const;
