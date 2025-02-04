import '@/styles/main.scss';
import dynamic from 'next/dynamic';
import { token } from '@/sanity/env';
import { draftMode } from 'next/headers';
import { PreviewBanner } from '@/components/preview/PreviewBanner';
import { getSiteData } from '@/sanity/lib/fetch';
import defineMetadata from '@/lib/defineMetadata';
import Layout from '@/layout';
import StyledJsxRegistry from '@/lib/registry';
import ReactQueryProvider from '@/lib/providers/ReactQueryProvider';
import StoreProvider from '@/lib/providers/StoreProvider';
import HeadTrackingCode from '@/layout/HeadTrackingCode';

const PreviewProvider = dynamic(
	() => import('@/components/preview/PreviewProvider')
);

export async function generateMetadata({ isPreviewMode }) {
	const data = await getSiteData({ isPreviewMode });
	return defineMetadata({ data });
}

export default async function RootLayout({ children, params }) {
	const isPreviewMode = draftMode().isEnabled;
	const { site } = await getSiteData({ isPreviewMode });
	const layout = <Layout siteData={site}>{children}</Layout>;
	const previewLayout = (
		<PreviewProvider token={token}>
			<PreviewBanner />
			{layout}
		</PreviewProvider>
	);

	const bodyContent = isPreviewMode ? previewLayout : layout;

	return (
		<StoreProvider>
			<ReactQueryProvider>
				<html lang="en">
					<head>
						<meta
							httpEquiv="Content-Type"
							charSet="UTF-8"
							content="text/html;charset=utf-8"
						/>
						<meta httpEquiv="X-UA-Compatible" content="IE=edge" />
						<HeadTrackingCode siteData={site} />
					</head>
					<StyledJsxRegistry>
						<body>{bodyContent}</body>
					</StyledJsxRegistry>
				</html>
			</ReactQueryProvider>
		</StoreProvider>
	);
}
