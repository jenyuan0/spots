import { get404PageData } from '@/sanity/lib/fetch';
import Page404 from './(pages)/_components/Page404';

export default async function NotFound() {
	const pageData = await get404PageData();
	const { page } = pageData || {};

	return <Page404 data={page} />;
}
