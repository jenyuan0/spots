'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Img from '@/components/Image';
import CustomPortableText from '@/components/CustomPortableText';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import Carousel from '@/components/Carousel';

const WhyBlock = ({ data }) => {
	const { image, heading, paragraph } = data;

	return (
		<div className="p-design__why-block">
			<div className="p-design__why-block__img">
				<span className="object-fit">{image && <Img image={image} />}</span>
			</div>
			<div className="p-design__why-block__text wysiwyg">
				<h2 className="p-design__why-block__heading t-h-4">{heading}</h2>
				<p className="p-design__why-block__paragraph t-b-2">{paragraph}</p>
			</div>
		</div>
	);
};

export default function SectionWhy({ data }) {
	const { whyHeading, whyParagraph, whyBlocks } = data;
	const { isTabletScreen } = useWindowDimensions();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) return null;

	return (
		<section className="p-design__why">
			<section className="p-design__why__header wysiwyg">
				{whyHeading && (
					<h2 className="t-h-2">
						<CustomPortableText blocks={whyHeading} hasPTag={false} />
					</h2>
				)}
				{whyParagraph && <p className="t-b-2">{whyParagraph}</p>}
			</section>
			{whyBlocks &&
				(isTabletScreen ? (
					<Carousel
						className="p-design__why__list"
						gap={'5vw'}
						isShowDots={true}
					>
						{whyBlocks.map((el, i) => {
							return <WhyBlock data={el} key={i} />;
						})}
					</Carousel>
				) : (
					<div className="p-design__why__list">
						{whyBlocks.map((el, i) => {
							return <WhyBlock data={el} key={i} />;
						})}
					</div>
				))}
		</section>
	);
}
