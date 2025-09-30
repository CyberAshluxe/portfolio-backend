    const express = require('express');
    const nodemailer = require('nodemailer');
    const cors = require('cors');
    require('dotenv').config(); // Load environment variables
        const app = express();
    app.use(cors());
    app.use(express.json()); // To parse JSON request bodies
        const transporter = nodemailer.createTransport({
        service: 'gmail', // Or other service/custom SMTP settings
        auth: {
            user: process.env.EMAIL_USER, // Your email from .env
            pass: process.env.EMAIL_PASS, // Your app password or email password from .env
        },
    });
        app.post('/send-email', async (req, res) => {
        const { name, email, subject, message } = req.body;

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.RECIPIENT_EMAIL, // Your email to receive messages
            subject: `Portfolio Contact Form: ${subject}`,
            html: `
                <p>Name: ${name}</p>
                <p>Email: ${email}</p>
                <p>Message: ${message}</p>
            `,
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).send('Email sent successfully!');
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).send('Error sending email.');
        }
    });