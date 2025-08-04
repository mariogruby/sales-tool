import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(to: string, subject: string, html: string) {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.RESET_FROM_EMAIL!,
            to,
            subject,
            html,
        });

        if (error) {
            console.error("Error sending email:", error);
            throw new Error("Failed to send email");
        }

        return data;
    } catch (err) {
        console.error("SendEmail error:", err);
        throw err;
    }
}