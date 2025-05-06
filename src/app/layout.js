import '@/styles/main.scss';
import dynamic from 'next/dynamic';
import { token } from '@/sanity/env';
import { draftMode } from 'next/headers';
import { PreviewBanner } from '@/components/preview/PreviewBanner';
import { getSiteData } from '@/sanity/lib/fetch';
import defineMetadata from '@/lib/defineMetadata';
import Layout from '@/layout';
import StyledJsxRegistry from '@/lib/registry';
import localFont from 'next/font/local';
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

const fontKalice = localFont({
	src: [
		{
			path: '../../public/fonts/kalice-regular.woff2',
			weight: '400',
			style: 'normal',
			fontDisplay: 'swap',
		},
		{
			path: '../../public/fonts/kalice-regular-italic.woff2',
			weight: '400',
			style: 'italic',
			fontDisplay: 'swap',
		},
		{
			path: '../../public/fonts/kalice-medium.woff2',
			weight: '500',
			style: 'normal',
			fontDisplay: 'swap',
		},
		{
			path: '../../public/fonts/kalice-medium-italic.woff2',
			weight: '500',
			style: 'italic',
			fontDisplay: 'swap',
		},
		{
			path: '../../public/fonts/kalice-bold.woff2',
			weight: '700',
			style: 'normal',
			fontDisplay: 'swap',
		},
		{
			path: '../../public/fonts/kalice-bold-italic.woff2',
			weight: '700',
			style: 'italic',
			fontDisplay: 'swap',
		},
	],
	variable: '--font-kalice',
});

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
				<html lang="en" className={`${fontKalice.variable}`}>
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
						<body>
							{bodyContent}{' '}
							<svg
								width="0"
								height="0"
								xmlns="http://www.w3.org/2000/svg"
								version="1.1"
							>
								<filter id="filter-round">
									<feGaussianBlur
										in="SourceGraphic"
										stdDeviation="8"
										result="blur"
									/>
									<feColorMatrix
										in="blur"
										mode="matrix"
										values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
										result="filter"
									/>
									<feComposite
										in="SourceGraphic"
										in2="filter"
										operator="atop"
									/>
								</filter>
							</svg>
						</body>
					</StyledJsxRegistry>
				</html>
			</ReactQueryProvider>
		</StoreProvider>
	);
}
