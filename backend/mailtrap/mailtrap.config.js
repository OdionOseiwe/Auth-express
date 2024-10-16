import { MailtrapClient } from "mailtrap"
import dotenv from 'dotenv'
dotenv.config();

const TOKEN = process.env.MAILTRAP_TOKEN;
const SENDER_EMAIL = "mailtrap@demomailtrap.com";

export const mailtrapClient = new MailtrapClient({ token: TOKEN });

export const sender = { name: "Oseiwe", email: SENDER_EMAIL };

// client
//   .send({
//     from: sender,
//     to: [{ email: RECIPIENT_EMAIL }],
//     subject: "Hello from Mailtrap!",
//     text: "Welcome to Mailtrap Sending!",
//   })
//   .then(console.log)
//   .catch(console.error);

 