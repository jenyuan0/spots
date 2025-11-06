import { NextResponse } from 'next/server';
import mailchimp from '@mailchimp/mailchimp_marketing';

export async function PUT(req) {
	const body = await req.json();
	const { audienceId, email } = body;

	const apiKey = process.env.MAILCHIMP_API_KEY;
	const server = process.env.MAILCHIMP_SERVER;
	mailchimp.setConfig({
		apiKey,
		server,
	});

	if (!email || !audienceId) {
		return NextResponse.json(
			{ error: 'Must contain an email address and audience ID' },
			{ status: 500 }
		);
	}

	try {
		const response = await mailchimp.lists.addListMember(audienceId, {
			email_address: email,
			status: 'pending',
		});
		return NextResponse.json(response);
	} catch (error) {
		const response = error.response.text;
		const { status, title, detail } = JSON.parse(response) || {};
		let errorMessage = '';

		if (title == 'Member Exists' && detail) {
			const match = detail.match(/(.*?) is already a list member\./);
			if (match && match[1]) {
				errorMessage = `${match[1]} is already signed up.`;
			} else {
				errorMessage = 'This email is already signed up.';
			}
			return NextResponse.json({ error: errorMessage }, { status });
		}

		return NextResponse.json({ error: errorMessage }, { status });
	}
}
