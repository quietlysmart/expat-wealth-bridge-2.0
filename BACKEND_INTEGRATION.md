# Backend Integration Guide

## Contact Form Email Integration

The contact form is currently set up to work locally without any backend. When you're ready to enable email sending, follow these steps:

### 1. Configure the Backend Endpoint

Edit `src/config/api.ts`:

```typescript
export const API_CONFIG = {
  ENABLE_BACKEND: true,  // Change this to true
  BACKEND_ENDPOINT: 'https://your-domain.com/api/contact',  // Your actual endpoint
  RECIPIENT_EMAIL: 'daniel.whiting@holbornassets.com'
}
```

### 2. API Endpoint Requirements

Your backend endpoint should:

- Accept **POST** requests
- Expect **JSON** content type
- Receive this structure:

```json
{
  "name": "string",
  "email": "string",
  "countryOfResidence": "string",
  "countryOfOrigin": "string",
  "preferredCallDate": "2025-01-15T00:00:00.000Z",
  "preferredCallTime": "14:30",
  "timezone": "Asia/Bangkok",
  "notes": "string"
}
```

- Return this response:

```json
{
  "success": true,
  "message": "Optional success message"
}
```

### 3. Backend Implementation Examples

#### Option A: Simple PHP Endpoint (SiteGround)

Create `api/contact.php`:

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$data = json_decode(file_get_contents('php://input'), true);

$to = 'daniel.whiting@holbornassets.com';
$subject = 'New Contact Form Submission from ' . $data['name'];
$message = "Name: {$data['name']}\nEmail: {$data['email']}\n...";

if (mail($to, $subject, $message)) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send']);
}
?>
```

#### Option B: Node.js / Express

```javascript
app.post('/api/contact', async (req, res) => {
  const formData = req.body;
  
  // Use nodemailer, sendgrid, etc.
  await sendEmail({
    to: 'daniel.whiting@holbornassets.com',
    subject: `New Contact: ${formData.name}`,
    body: formatEmailBody(formData)
  });
  
  res.json({ success: true });
});
```

### 4. Testing

1. Enable the backend in `src/config/api.ts`
2. Submit the form
3. Check your email inbox
4. Check browser console for any errors

### 5. Error Handling

The frontend already handles:
- Network errors (shows error toast)
- Success responses (shows success toast)
- Loading states (disables button during submission)

---

**Current Status**: Frontend-only mode (no backend required for local development)
