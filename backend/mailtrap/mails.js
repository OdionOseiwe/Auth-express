import { mailtrapClient, sender} from "../mailtrap/mailtrap.config.js";
import {signupVerificationTemplate, welcomeEmailTemplate, forgetPasswordEmailTemplate,sendPasswordResetSucessfulTemplate} from "../mailtrap/mailTemplate.js"

export const sendVerificationEmail = async(email, verificationToken) =>{
    try {
        const reponse = mailtrapClient.send({
            from: sender,
            to: [{ email: email }],
            subject: "Verification Email",
            html: signupVerificationTemplate.replace("{VERIFICATION_TOKEN}",verificationToken),
            category:"email verification",
        })

        console.log("email sent sucessfully", await reponse);
        
    } catch (error) {
        console.log("Error from Mailtrap while sending mail", error);
    }
}

export const sendWelcomeEmail = async(email,userName) =>{
    try {
        const reponse = mailtrapClient.send({
            from: sender,
            to: [{ email: email }],
            subject: "Welcome Email",
            html: welcomeEmailTemplate.replace("{USER}",userName),
            category:"welcome email",
        })

        console.log("email sent sucessfully", await reponse);
    } catch (error) {
        console.log("error sending email",error);
        
    }
}

export const sendForgotPasswordEmail = async(email,resetUrl) =>{
    try {
        const reponse = mailtrapClient.send({
            from: sender,
            to: [{ email: email }],
            subject: "reset password",
            html: forgetPasswordEmailTemplate.replace("{RESET_LINK}",resetUrl),
            category:"reset password email",
        })

        console.log("email sent sucessfully", await reponse);
    } catch (error) {
        console.log("error sending email",error);
        
    }
}

export const sendSetPasswordSucessfullyEamil = async(email) =>{
    try {
        const reponse = mailtrapClient.send({
            from: sender,
            to: [{ email: email }],
            subject: "reset password",
            html: sendPasswordResetSucessfulTemplate,
            category:"reset sucesfully email",
        })

        console.log("email sent sucessfully", await reponse);
    } catch (error) {
        console.log("error sending email",error);
        
    }
}