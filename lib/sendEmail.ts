import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER!,
        pass: process.env.SMTP_PASS!,
    },
})

const from = () => `"${process.env.SMTP_FROM_NAME ?? "EasyPOS"}" <${process.env.SMTP_USER}>`

export async function sendEmail(to: string, subject: string, html: string) {
    await transporter.sendMail({ from: from(), to, subject, html })
}

export async function sendEmailWithAttachment({
    to,
    subject,
    html,
    attachment,
}: {
    to: string
    subject: string
    html: string
    attachment: { filename: string; content: Buffer }
}) {
    await transporter.sendMail({
        from: from(),
        to,
        subject,
        html,
        attachments: [{ filename: attachment.filename, content: attachment.content }],
    })
}
