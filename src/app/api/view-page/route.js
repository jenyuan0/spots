import { redirect } from 'next/navigation';
import { getRoute } from '@/lib/routes';
import { client } from '@/sanity/lib/client';
import * as queries from '@/sanity/lib/queries';

export async function GET(request) {
	const { searchParams } = new URL(request.url);
	const docId = searchParams.get('docId');
	const slug = searchParams.get('slug');
	const documentType = searchParams.get('documentType');
	const homePageID = await client.fetch(queries.homeID);

	if (docId.includes(homePageID)) {
		redirect('/');
	}

	const url = getRoute({ documentType, slug });
	redirect(url);
}
