import nodemailer from "nodemailer";
import config from "../config";

export const sendEmail = async (to: string, html: string) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com.",
        port: 587,
        secure: config.NODE_ENV === "production", // true for port 465, false for other ports
        auth: {
            user: "kr.hasanbd@gmail.com",
            pass: "zuewggmsjcsrfqsn",
        },
    });

    // send mail with defined transport object
    await transporter.sendMail({
        from: "kr.hasanbd@gmail.com", // sender address
        to, // list of receivers
        subject: "Forgot Password", // Subject line
        text: "", // plain text body
        html, // html body
    });
};
