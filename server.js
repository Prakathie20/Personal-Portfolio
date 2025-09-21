require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.post('/contact', async (req, res) => {
    const { name, email, message } = req.body;

    // Check if environment variables are loaded
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.error('Email credentials not found in environment variables');
        return res.status(500).json({ success: false, error: 'Server configuration error' });
    }

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: email,
        to: process.env.EMAIL_TO || process.env.EMAIL_USER,
        subject: `Portfolio Contact: ${name}`,
        text: message
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, error: error.message, details: error });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
