import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req) {
	const body = await req.json();
	const { type, email, emailSubject, emailHtmlContent } = body;

	if (!type || !email || !emailSubject || !emailHtmlContent) {
		return NextResponse.json(
			{
				message: 'Missing required fields: type, email, subject, or content.',
			},
			{ status: 500 }
		);
	}

	try {
		// create reusable transporter object using the default SMTP transport
		const transporter = nodemailer.createTransport({
			service: 'gmail',
			host: process.env.EMAIL_SERVER_HOST,
			port: process.env.EMAIL_SERVER_PORT,
			secure: true, // true for 465, false for other ports
			auth: {
				user: process.env.EMAIL_SERVER_USER,
				pass: process.env.EMAIL_SERVER_PASSWORD,
			},
		});

		const emailFrom = process.env.EMAIL_DISPLAY_NAME;
		const mailOptions = {
			from: `"${emailFrom}" <${process.env.EMAIL_SERVER_USER}>`,
			to: email,
			subject: `[${type} Notification] ${emailSubject}`,
			html: `${emailHtmlContent}<br><br>Best regards, <br>${emailFrom} Team`,
		};

		try {
			const info = await transporter.sendMail(mailOptions);
			return NextResponse.json({ message: info.response }, { status: 200 });
		} catch (error) {
			return NextResponse.json(
				{ error: error, message: 'email sending failed' },
				{ status: 500 }
			);
		}
	} catch (error) {
		return NextResponse.json(
			{ error: error, message: 'create transport failed' },
			{ status: 500 }
		);
	}
}
