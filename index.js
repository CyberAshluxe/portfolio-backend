const express = require("express");
const cors = require("cors");
const { Resend } = require("resend");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ Test route (optional)
app.get("/", (req, res) => {
  res.json({ message: "🚀 Backend is running and ready to send emails!" });
});

// ✅ Email sending route
app.post("/send-email", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }

  try {
    const data = await resend.emails.send({
      from: `${name} <onboarding@resend.dev>`, // default free domain
      to: process.env.RECIPIENT_EMAIL, // your personal email
      subject: `📩 Portfolio Message: ${subject}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    console.log("✅ Email sent:", data);
    res.status(200).json({ success: true, message: "✅ Email sent successfully!" });
  } catch (error) {
    console.error("❌ Error sending email:", error);
    res.status(500).json({
      success: false,
      message: "❌ Failed to send email. Please try again later.",
      error: error.message,
    });
  }
});

// ✅ Start server
const PORT = process.env.PORT || 5880;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
