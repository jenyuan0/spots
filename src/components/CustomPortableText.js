import { PortableText } from '@portabletext/react';
import React from 'react';
import Link from '@/components/CustomLink';
import PortableTable from './PortableTable';
import Img from '@/components/Image';

export default function CustomPortableText({ blocks, hasPTag = true }) {
	if (!blocks) return null;

	const portableTextComponents = {
		block: {
			...(!hasPTag && { normal: ({ children }) => <>{children}</> }),
			h1: ({ children }) => <h1>{children}</h1>,
			h2: ({ children }) => <h2>{children}</h2>,
			h3: ({ children }) => <h3>{children}</h3>,
			h4: ({ children }) => <h4>{children}</h4>,
			h5: ({ children }) => <h5>{children}</h5>,
			h6: ({ children }) => <h6>{children}</h6>,
		},
		list: {
			bullet: ({ children }) => <ul>{children}</ul>,
			number: ({ children }) => <ol>{children}</ol>,
		},
		types: {
			image: (data) => {
				const { value } = data;
				if (!value?.asset) return;

				const { link } = value || {};
				if (link && link?.route) {
					return (
						<Link href={link.route} isNewTab={link.isNewTab}>
							<Img image={value} />
						</Link>
					);
				}
				return <Img image={value} />;
			},
			iframe: ({ value }) => {
				const { embedSnippet } = value;
				if (!embedSnippet) {
					return null;
				}
				const width = embedSnippet.match(/width="\s*(\d+)"/)[1];
				const height = embedSnippet.match(/height="\s*(\d+)"/)[1];
				const aspectRatio =
					width && height ? `${(height / width) * 100}%` : '56.25%';

				return (
					<>
						<div
							className="iframe-container"
							dangerouslySetInnerHTML={{ __html: embedSnippet }}
						/>
						<style jsx>{`
							.iframe-container {
								position: relative;
								height: 0;
								overflow: hidden;
								max-width: 100%;
								padding-bottom: ${aspectRatio};
							}
							:global(.iframe-container iframe) {
								position: absolute;
								top: 0;
								left: 0;
								width: 100%;
								height: 100%;
							}
						`}</style>
					</>
				);
			},
			portableTable: (props) => {
				const { value } = props;
				return <PortableTable blocks={value} />;
			},
		},
		marks: {
			link: ({ value, children }) => {
				return (
					<Link href={value?.route} isNewTab={value?.isNewTab}>
						{children}
					</Link>
				);
			},
			callToAction: ({ value, children }) => {
				return (
					<Link href={value?.route} isNewTab={value?.isNewTab}>
						{children}
					</Link>
				);
			},
		},
	};

	return <PortableText value={blocks} components={portableTextComponents} />;
}
