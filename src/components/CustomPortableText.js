import { PortableText } from '@portabletext/react';
import React from 'react';
import Link from '@/components/CustomLink';
import PortableTable from './PortableTable';
import Img from '@/components/Image';
import LocationList from '@/components/LocationList';
import LocationCard from '@/components/LocationCard';

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
			'large-paragraph': ({ children }) => (
				<p className="large-paragraph">{children}</p>
			),
		},
		list: {
			bullet: ({ children }) => <ul>{children}</ul>,
			number: ({ children }) => <ol>{children}</ol>,
		},
		types: {
			image: (data) => {
				const { value } = data;
				if (!value?.asset) return;

				const { link, caption } = value || {};
				const image =
					link && link?.route ? (
						<Link href={link.route} isNewTab={link.isNewTab}>
							<Img image={value} />
						</Link>
					) : (
						<Img image={value} />
					);

				return (
					<div className="c-portable-image">
						{image}
						{caption && <p className="c-portable-image__caption">{caption}</p>}
					</div>
				);
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
				const aspectRatio = width && height ? width / height : null;

				return (
					<div
						className="c-iframe"
						style={aspectRatio && { '--aspect-ratio': aspectRatio }}
						dangerouslySetInnerHTML={{ __html: embedSnippet }}
					/>
				);
			},
			portableTable: (props) => {
				const { value } = props;
				return <PortableTable blocks={value} />;
			},
			locationSingle: (props) => {
				const { value } = props;

				if (!value?.location) return null;

				return (
					<LocationCard
						data={value.location}
						contentReplace={value.location.contentReplace}
						color={value?.location?.color}
						layout="embed"
						hasDirection={true}
					/>
				);
			},
			locationList: (props) => {
				const { value } = props;

				if (!value?.locations) return null;

				return <LocationList data={value} />;
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
