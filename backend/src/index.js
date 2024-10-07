import express from 'express';
import { configDotenv } from 'dotenv';
import UserModel from './models/UserModel.js';
import VehicleModel from './models/VehicleModel.js';
import { pool } from './db/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import helmet from 'helmet'
import cors from 'cors'

configDotenv();

const app = express();
app.use(express.json());
app.use(helmet())
app.use(cors())

const port = process.env.PORT || 8081;

// OTP Storage (could use Redis for better scalability)
const otps = new Map();

// Email transporter configuration using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

// Helper function to send OTP to user's email
const sendOTP = (email, otp) => {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Your OTP for Login',
        text: `Your OTP for login is: ${otp}`
    };

    return transporter.sendMail(mailOptions);
};

// Login route with OTP generation
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const query = `SELECT * FROM users WHERE email = $1;`;
        const values = [email];
        const dbUser = await pool.query(query, values);

        if (dbUser.rowCount === 0) {
            return res.status(401).send("User not found");
        }

        const hashedPassword = dbUser.rows[0].password;
        const isPasswordCorrect = await bcrypt.compare(password, hashedPassword);

        if (!isPasswordCorrect) {
            return res.status(401).send("Incorrect Password");
        }

        // Generate 6-digit OTP
        const otp = crypto.randomInt(100000, 999999).toString();
        otps.set(email, otp); // Store OTP with a timeout
        setTimeout(() => otps.delete(email), 5 * 60 * 1000); // OTP valid for 5 mins

        // Send OTP via email
        await sendOTP(email, otp);
        return res.status(200).send("OTP has been sent to your email.");
    } catch (error) {
        return res.status(401).send("Error while logging in: " + error);
    }
});

// OTP verification route
app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    const validOtp = otps.get(email);

    if (!validOtp) {
        return res.status(401).send("OTP expired or not found");
    }

    if (validOtp !== otp) {
        return res.status(401).send("Invalid OTP");
    }

    // Generate JWT Token
    const query = `SELECT * FROM users WHERE email = $1;`;
    const values = [email];
    const dbUser = await pool.query(query, values);

    const payload = {
        id: dbUser.rows[0].id,
    };

    const jwtToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Clear OTP after successful verification
    otps.delete(email);

    return res.status(200).send({ jwtToken });
});

// Register new users
app.post('/register', async (req, res) => {
    const { name, email, password, phone_number } = req.body;

    try {
        await UserModel.createUser(name, email, password, phone_number);
        res.status(201).send("User Created Successfully");
    } catch (error) {
        res.status(401).send("Error while creating User: " + error);
    }
});

// Register new vehicles
app.post('/register-vehicle', async (req, res) => {
    const { vehicle_number, vehicle_type, user_id } = req.body;

    try {
        await VehicleModel.addVehicle(vehicle_number, vehicle_type, user_id);
        res.status(201).send("Vehicle Added Successfully");
    } catch (error) {
        res.status(401).send("Error while adding vehicle: " + error);
    }
});

// Initialize the database and start the server
const initalizeDBAndServer = async () => {
    try {
        await UserModel.createUsersTable();
        await VehicleModel.createVehicleTable();
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    } catch (error) {
        console.log("Error connecting to DB: ", error);
        process.exit(1);
    }
};

initalizeDBAndServer();
