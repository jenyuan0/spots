import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { getRoute } from '@/lib/routes';
import { client } from '@/sanity/lib/client';
import { previewSecretId, token } from '@/sanity/env';
import { getPageBySlug } from '@/sanity/lib/fetch';
import * as queries from '@/sanity/lib/queries';

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const docId = searchParams.get('docId');
	const secret = searchParams.get('secret');
	const slug = searchParams.get('slug');
	const documentType = searchParams.get('documentType');

	if (!token) {
		throw new Error(
			'The `SANITY_API_READ_TOKEN` environment variable is required.'
		);
	}

	if (secret !== previewSecretId) {
		return new Response('Invalid secret', { status: 401 });
	}

	const homePageID = await client.fetch(queries.homeID);

	if (docId.includes(homePageID)) {
		draftMode().enable();
		redirect('/');
	}

	if (documentType === 'pGeneral') {
		const queryParams = { slug };
		const data = await getPageBySlug({ queryParams });
		// If the slug doesn't exist prevent draft mode from being enabled
		if (!data) {
			return new Response(
				'Unable to resolve preview URL based on the current document type and slug',
				{ status: 400 }
			);
		}

		draftMode().enable();
		redirect(`/${slug}`);
	}

	if (documentType === 'p404') {
		draftMode().enable();
		redirect(`/not-found`);
	}

	draftMode().enable();
	const url = getRoute({ documentType, slug });
	redirect(url);
}
