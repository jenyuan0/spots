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
				const widthMatch = embedSnippet.match(/width="\s*(\d+)"/);
				const heightMatch = embedSnippet.match(/height="\s*(\d+)"/);
				const width = widthMatch?.[1];
				const height = heightMatch?.[1];
				const aspectRatio = width && height ? width / height : 1.77;

				return (
					<div
						className="c-iframe"
						style={{ '--aspect-ratio': aspectRatio }}
						dangerouslySetInnerHTML={{ __html: embedSnippet }}
					/>
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
