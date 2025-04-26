import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { formatObjectToHtml } from '@/lib/helpers';

export async function POST(req) {
	const body = await req.json();
	const { sendToEmail, emailSubject, formData } = body;
	const authUser = process.env.EMAIL_SERVER_USER;
	const authPassword = process.env.EMAIL_SERVER_PASSWORD;
	const emailFrom = process.env.EMAIL_DISPLAY_NAME;
	console.log(authUser, authPassword, emailFrom);
	try {
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
			port: process.env.EMAIL_SERVER_PORT || 465,
			secure: true, // true for 465, false for other ports
			auth: {
				user: authUser,
				pass: authPassword,
			},
		});
		const mailOptions = {
			from: `"${emailFrom}" <${authUser}>`,
			to: sendToEmail,
			replyTo: formData?.email || sendToEmail,
			subject: emailSubject,
			html: formatObjectToHtml(formData),
		};

		const info = await transporter.sendMail(mailOptions);
		return Response.json(info);
	} catch (err) {
		return NextResponse.json(
			{
				status: 'error',
				message: err.message,
				details: err.toString(),
			},
			{ status: 500 }
		);
	}
}
