import nodemailer from 'nodemailer';
import { formatObjectToHtml } from '@/lib/helpers';
import { NextResponse } from 'next/server';

export async function POST(req) {
	const body = await req.json();
	const { sendToEmail, emailSubject, formData } = body;
	const authUser = process.env.EMAIL_SERVER_USER;
	const authPassword = process.env.EMAIL_SERVER_PASSWORD;
	const emailFrom = process.env.EMAIL_DISPLAY_NAME;

	try {
		// Create transporter
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
			port: process.env.EMAIL_SERVER_PORT || 465,
			secure: true,
			auth: {
				user: authUser,
				pass: authPassword,
			},
		});

		// Verify transporter connection
		try {
			await transporter.verify();
			console.log('Transporter connection verified');
		} catch (error) {
			console.error('Transporter verification failed:', error);
			throw error;
		}
		const mailOptions = {
			from: `"${emailFrom}" <${authUser}>`,
			to: sendToEmail,
			replyTo: formData?.email || sendToEmail,
			subject: `${emailSubject}${formData?.name && ` [${formData.name}]`}`,
			html: formatObjectToHtml(formData),
		};

		const info = await transporter.sendMail(mailOptions);
		return Response.json(info);
	} catch (err) {
		console.error('Email sending failed:', {
			name: err.name,
			message: err.message,
			code: err.code,
			command: err.command,
			response: err.response,
			responseCode: err.responseCode,
		});

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
