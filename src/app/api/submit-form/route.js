import nodemailer from 'nodemailer';
import { formatObjectToHtml } from '@/lib/helpers';

export async function POST(req) {
	const body = await req.json();
	const { sendToEmail, emailSubject, formData } = body;
	const authUser = process.env.EMAIL_SERVER_USER;
	const authPassword = process.env.EMAIL_SERVER_PASSWORD;
	const emailFrom = process.env.EMAIL_EMAIL_FROM;

	try {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			host: 'smtp.gmail.com',
			port: 465,
			secure: true, // true for 465, false for other ports
			auth: {
				user: authUser,
				pass: authPassword,
			},
		});

		// send to client
		const mailOptions = {
			from: `"${emailFrom}" <${authUser}>`,
			to: sendToEmail,
			subject: emailSubject,
			html: formatObjectToHtml(formData),
		};

		const info = await transporter.sendMail(mailOptions);
		return Response.json(info);
	} catch (err) {
		console.error(err);
		return Response.json({ error }, { status: 500 });
	}
}
