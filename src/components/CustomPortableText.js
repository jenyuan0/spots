import { PortableText } from '@portabletext/react';
import React, { useMemo } from 'react';
import Link from '@/components/CustomLink';
import PortableTable from './PortableTable';
import Img from '@/components/Image';
import LocationList from '@/components/LocationList';
import LocationCard from '@/components/LocationCard';
import Carousel from '@/components/Carousel';

export function Image({ data }) {
	if (!data?.asset) return;

	const { link, caption } = data || {};
	const image =
		link && link?.route ? (
			<Link href={link.route} isNewTab={link.isNewTab}>
				<Img image={data} />
			</Link>
		) : (
			<Img image={data} />
		);

	return (
		<figure className="c-portable-image">
			{image}
			{caption && (
				<figcaption className="c-portable-image__caption">{caption}</figcaption>
			)}
		</figure>
	);
}

export function Iframe({ data }) {
	const { embedSnippet } = data;

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
}

export default function CustomPortableText({ blocks, hasPTag = true }) {
	// Memoize components to prevent unnecessary rerenders

	const portableTextComponents = useMemo(
		() => ({
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
				image: (data) => <Image data={data?.value} />,
				iframe: (data) => <Iframe data={data?.value} />,
				portableTable: (data) => {
					return <PortableTable blocks={data?.value} />;
				},
				carousel: (data) => {
					const { value } = data;

					if (!value?.items) return null;

					return (
						<Carousel gap={'10px'}>
							{value.items.map((item, i) => (
								<div key={`image-${i}`} className="c-carousel-item">
									{item._type == 'image' ? (
										<>
											<Image data={item} />
										</>
									) : (
										<Iframe data={item} />
									)}
								</div>
							))}
						</Carousel>
					);
				},
				locationSingle: (data) => {
					const { value } = data;

					if (!value?.location) return null;

					return (
						<LocationCard
							data={value.location}
							contentReplace={value.contentReplace}
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
		}),
		[hasPTag]
	); // Only recompute when hasPTag changes

	if (!blocks) return null;
	return <PortableText value={blocks} components={portableTextComponents} />;
}
