import { draftMode } from 'next/headers';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request) {
	draftMode().disable();
	const headersList = headers();
	const referer = headersList.get('referer');
	redirect(referer);
}
