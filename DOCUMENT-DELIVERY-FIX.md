# Document Delivery Email Fix - Troubleshooting Guide

## Problem
When sending documents, the upload succeeds but email delivery fails with "Delivery Failed" after a long timeout.

---

## Root Causes Identified

### 1. **Missing Timeout Configuration** ❌
The nodemailer transporter didn't have timeout settings, causing failures on large files.

### 2. **No Connection Pooling** ❌
Each email created a new connection, reducing reliability for multiple document sends.

### 3. **No Attachment Size Validation** ❌
Large files would fail silently during transmission without error feedback.

### 4. **No Retry Mechanism** ❌
Failed email sends weren't retried or split into smaller batches.

---

## Solutions Implemented

### ✅ 1. Enhanced Email Transporter Configuration

**File:** `backend/config/emailService.js`

Added timeout and connection pooling settings:

```javascript
const createTransporter = () => {
  return nodemailer.createTransport({
    // ... auth settings
    connectionTimeout: 30000,  // 30 seconds to connect
    socketTimeout: 60000,      // 60 seconds for socket ops
    greetingTimeout: 10000,    // 10 seconds for SMTP greeting
    pool: {
      maxConnections: 5,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 10,
    },
  });
};
```

**Benefits:**
- Prevents hanging connections
- Reuses connections for better efficiency
- Handles larger files gracefully

---

### ✅ 2. Intelligent Attachment Size Validation

**File:** `backend/config/emailService.js`

Added pre-send validation in `sendDocumentDeliveryEmail`:

```javascript
// Validate attachment sizes before sending
const MAX_ATTACHMENT_SIZE = 25 * 1024 * 1024;  // 25MB per file
const MAX_TOTAL_SIZE = 100 * 1024 * 1024;       // 100MB total

// Skip oversized files with warning
// Prevents silent failures
```

**Benefits:**
- Clear feedback on file size issues
- Gracefully skips oversized files
- Logs detailed information

---

### ✅ 3. Batch Delivery for Large Documents

**File:** `backend/config/emailService.js`

New function: `sendLargeDocumentDelivery` splits documents across multiple emails:

```javascript
export const sendLargeDocumentDelivery = async (deliveryData) => {
  // Sends in batches of max 20MB per email
  // Automatically splits large deliveries
}
```

**How it works:**
1. Calculate total attachment size
2. If > 20MB, split into multiple emails
3. Send each batch separately
4. Label each batch for customer clarity

**Benefits:**
- Handles projects with many/large documents
- Never exceeds email server limits
- Transparent to user (labeled as parts)

---

### ✅ 4. Improved Error Handling

**File:** `backend/config/emailService.js`

Specific error messages for different failure types:

```javascript
if (error.code === 'ETIMEDOUT' || error.code === 'ESOCKETTIMEDOUT') {
  errorMessage = 'Email server timeout. Large attachments may need time.';
} else if (error.code === 'ECONNREFUSED') {
  errorMessage = 'Could not connect to email server.';
} else if (error.message.includes('size')) {
  errorMessage = 'Attachment size exceeds limit.';
}
```

---

### ✅ 5. Non-Blocking Supabase Upload

**File:** `backend/server.js`

Changed upload to run in background:

```javascript
// Non-blocking - email sends first, upload happens in background
setTimeout(() => {
  uploadMultipleFiles(...)
    .catch(err => logger.error('Background upload failed:', err));
}, 0);
```

**Benefits:**
- Email sends immediately
- Upload doesn't block response
- Both complete successfully independently

---

## Configuration Requirements

### Environment Variables

Ensure these are set in your `.env` file (these should already be configured):

```env
EMAIL_HOST=smtp.gmail.com              # Gmail SMTP
EMAIL_PORT=587                         # Standard TLS port
EMAIL_SECURE=false                     # TLS (not SSL)
EMAIL_USER=your-email@gmail.com        # Your Gmail
EMAIL_PASSWORD=your-app-password       # Google App Password (NOT regular password)
ADMIN_EMAIL=admin@zimscholar.local
```

### Gmail-Specific Setup

If using Gmail (recommended):

1. **Enable 2-Factor Authentication** on your Google account
2. **Generate App Password**:
   - Go to Google Account → Security
   - Select "App passwords"
   - Choose "Mail" and "Windows Computer"
   - Copy the 16-character password
   - Use in `.env` as `EMAIL_PASSWORD`

---

## Testing the Fix

### Quick Test Script

Create `test-document-delivery.js`:

```javascript
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

const API_URL = 'http://localhost:5000/api/admin/deliver-documents';
const AUTH_TOKEN = 'your-auth-token'; // Get from admin login

(async () => {
  try {
    const form = new FormData();
    
    // Add form fields
    form.append('recipientEmail', 'test@email.com');
    form.append('recipientName', 'Test User');
    form.append('projectTitle', 'Test Project');
    form.append('projectType', 'Research Paper');
    form.append('message', 'Here are your documents');
    
    // Add small test file
    form.append('documents', fs.createReadStream('test-file.pdf'));
    
    const response = await axios.post(API_URL, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${AUTH_TOKEN}`
      },
      timeout: 120000 // 2 minutes - large files need time
    });
    
    console.log('✅ Email sent successfully:', response.data);
  } catch (error) {
    console.error('❌ Email failed:', error.response?.data || error.message);
  }
})();
```

Run with:
```bash
node test-document-delivery.js
```

---

## Troubleshooting Checklist

| Issue | Solution |
|-------|----------|
| **Timeout after 30 seconds** | Check `connectionTimeout` setting. Increase if needed. |
| **"Connection refused"** | Verify EMAIL_HOST and EMAIL_PORT are correct. Check Gmail SMTP settings. |
| **"Invalid credentials"** | Use Google App Password, not regular password. Generate new one if needed. |
| **Attachment size error** | Files must be < 25MB each, total < 100MB. Split into smaller batches. |
| **"Delivery Failed" after upload** | Check email server logs. May be rate-limited. Wait 5 mins and retry. |
| **Some attachments missing** | Check file size limits. System skips oversized files and logs them. |

---

## Performance Tuning

### For Large Documents (50MB+)

**Option 1: Increase Timeouts** (in emailService.js)
```javascript
socketTimeout: 120000,  // 2 minutes instead of 60 seconds
```

**Option 2: Use Cloud Storage Links** (Alternative approach)
Instead of email attachments, send download links:
```javascript
// Upload to Supabase first
// Generate signed URLs
// Send URLs in email body
```

### For Multiple Sends (Admin dashboard)

Monitor the connection pool:
```javascript
pool: {
  maxConnections: 10,      // Increase if many emails
  maxMessages: 200,
  rateLimit: 20,           // Adjust based on server
}
```

---

## What Was Changed

### Files Modified

1. **`backend/config/emailService.js`**
   - Added timeout settings to transporter
   - Rewrote `sendDocumentDeliveryEmail` with validation
   - Added `sendLargeDocumentDelivery` function
   - Improved error messages

2. **`backend/server.js`**
   - Updated imports to include `sendLargeDocumentDelivery`
   - Changed Supabase upload to non-blocking
   - Improved endpoint error handling
   - Added file size validation feedback

---

## Monitoring

### Enable Debug Logging

Add to `server.js`:
```javascript
process.env.LOG_LEVEL = 'debug'; // See detailed email logs
```

Check logs:
```bash
# Watch logs in real-time
tail -f backend/logs/error.log

# Search for delivery issues
grep "delivery" backend/logs/error.log
```

---

## Next Steps If Issues Persist

1. **Check email server status**
   ```bash
   telnet smtp.gmail.com 587
   ```

2. **Test SMTP connection directly**
   ```bash
   npm install nodemailer
   # Then run test-document-delivery.js
   ```

3. **Check rate limiting**
   - Gmail limits ~300 emails/hour
   - Check if admin is sending too many
   - Add `deliverDocumentsLimiter` to rate limiter config

4. **Enable email server debugging**
   - Add to transporter: `logger: true, debug: true`
   - Watch console output

---

## Support

If document delivery still fails:

1. Check `backend/logs/error.log` for specific error
2. Note the exact error code (ETIMEDOUT, ECONNREFUSED, etc.)
3. Verify environment variables are set correctly
4. Test with a single small file first
5. Gradually increase file size to find the limit

---

**Last Updated:** March 2026
**Status:** ✅ Fixed and tested
