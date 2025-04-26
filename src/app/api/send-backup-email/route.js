import { NextResponse } from 'next/server';

export async function POST(req) {
	const { searchParams } = new URL(req.url);
	const body = await req.json();
	const useTransporter2 = searchParams.get('useTransporter2') || false;
	const { email, emailSubject, emailHtmlContent } = body;
	const emailData = {
		type: 'Error',
		to: email,
		subject: emailSubject,
		cc: 'jen@view-source.com',
		htmlContent: emailHtmlContent,
	};

	try {
		const response = await fetch(
			`${process.env.VS_API_URL}/email/send-notification-email?useTransporter2=${useTransporter2}`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(emailData),
			}
		);

		const data = await response.json();
		if (!response.ok) {
			return NextResponse.json(
				{ success: data.success, useTransporter2 },
				{ status: 200 }
			);
		}

		return NextResponse.json(response);
	} catch (error) {
		return NextResponse.json(error, { status: 500 });
	}
}
