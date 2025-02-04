import { NextResponse } from 'next/server';

export async function POST(req) {
	const body = await req.json();
	/* do the form api here */
	/* Simulate a form submission failure.
		return NextResponse.json(
			{ state: 'error', message: 'Form Failed' },
			{ status: 500 }
		);
	*/

	try {
		return NextResponse.json({
			state: 'success',
			message: 'Form submitted successfully',
		});
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ state: 'error', message: err.message },
			{ status: 500 }
		);
	}
}
