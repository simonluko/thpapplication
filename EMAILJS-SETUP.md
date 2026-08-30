# EmailJS Setup Guide

## Email Template Variables

When setting up your email template in EmailJS, use the following variables. These correspond to the form fields:

### Template Variables to Map:

```
{{email}}               - Contact email address
{{phone}}               - Contact phone number
{{gender}}              - Male or Female
{{currentStateGoals}}   - List of selected goals (comma-separated)
{{bodyFatCurrent}}      - Current body fat percentage
{{bodyFatGoal}}         - Goal body fat percentage
{{symptoms}}            - List of symptoms (comma-separated)
{{bloodworkStatus}}     - Bloodwork status (Yes/No but willing/No not interested)
{{testosteroneLevel}}   - Testosterone level (if applicable)
{{previousAttempts}}    - List of what they've tried (comma-separated)
{{whyStillLooking}}     - Long text answer
{{timeline}}            - Timeline selection
{{commitmentLevel}}     - Number from 1-10
{{willingTo}}           - List of commitments (comma-separated)
{{consequences}}        - Long text answer
{{investmentRange}}     - Selected budget range
```

## EmailJS Integration Steps:

1. **Create EmailJS Account**
   - Go to https://www.emailjs.com/
   - Sign up for a free account

2. **Add Email Service**
   - Connect your email service (Gmail, Outlook, etc.)
   - Note your Service ID

3. **Create Email Template**
   - Create a new template in EmailJS
   - Copy the HTML from `email-template.html`
   - Paste it into the "Content" section
   - The variables {{email}}, {{phone}}, etc. will automatically be replaced

4. **Get Your Credentials**
   - Public Key (User ID)
   - Service ID
   - Template ID

5. **Install EmailJS Package**
   ```bash
   npm install @emailjs/browser
   ```

6. **Add to Environment Variables**
   Add these to your `.env` file:
   ```
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

## How the Email Will Look:

- **Header**: Black background with white text "New THP Coaching Application"
- **Contact Section**: Gray background with email and phone
- **Organized Sections**: Each category (Goals, Symptoms, etc.) in its own section
- **Clean Layout**: Professional black and white design matching your form
- **Mobile Responsive**: Works on all email clients

## Notes:

- Arrays (like goals, symptoms) will be displayed as comma-separated lists
- Long text fields preserve line breaks
- The template uses inline CSS for maximum email client compatibility
- All borders and styling match your form's black and white theme
