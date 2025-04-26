import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
	const body = await req.json();
	const { email, emailSubject, emailHtmlContent } = body;
	const authUser = process.env.EMAIL_SERVER_USER;
	const authPassword = process.env.EMAIL_SERVER_PASSWORD;
	const emailFrom = process.env.EMAIL_EMAIL_FROM;

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
			to: email,
			subject: `[Error Notification] ${emailSubject}`,
			html: `${emailHtmlContent}`,
		};

		const info = await transporter.sendMail(mailOptions);
		return Response.json(info);
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ state: 'error', message: err.message },
			{ status: 500 }
		);
	}
}
