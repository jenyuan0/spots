'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import clsx from 'clsx';
import { colorArray } from '@/lib/helpers';
import Img from '@/components/Image';
import CustomPortableText from '@/components/CustomPortableText';
import Button from '@/components/Button';
import { motion } from 'motion/react';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import Carousel from '@/components/Carousel';

// Constants
const ANIMATION_CONFIG = {
	ROTATION_INTERVAL: 1600,
	MASKS_INTERVAL: 6000,
	ROTATION_STEP: 30,
	SCROLL_OFFSET: ['-250px start', '-104px start'],
};

const WhyText = ({ data, color }) => {
	const { heading, paragraph, offers, cta } = data;

	return (
		<div className="p-design__why-block__text">
			<div className="p-design__why-block__text-container wysiwyg">
				<h2 className="p-design__why-block__heading t-h-3">{heading}</h2>
				<p className="p-design__why-block__paragraph t-b-2">{paragraph}</p>
				{offers && (
					<ul className="p-design__why-block__offers t-b-1">
						{offers?.map((item, index) => (
							<li key={`offer-${index}`}>{item}</li>
						))}
					</ul>
				)}
				{cta?.link && cta?.label && (
					<Button
						className={clsx('btn-outline', `cr-${color || 'brown'}-d`)}
						href={cta.link.route}
						isNewTab={cta.isNewTab}
						caret="right"
					>
						{cta.label}
					</Button>
				)}
			</div>
		</div>
	);
};

const MasksBlock = ({ data, color }) => {
	const { masksHeading, masksParagraph, masksOffers, masksCta } = data;
	const textData = {
		heading: masksHeading,
		paragraph: masksParagraph,
		offers: masksOffers,
		cta: masksCta,
	};

	return (
		<div
			className="p-design__why-block"
			style={{ '--cr-primary': `var(--cr-${color}-d)` }}
		>
			<WhyText data={textData} color={color} />
		</div>
	);
};

const ClockBlock = ({ data, color }) => {
	const { clockHeading, clockParagraph, clockOffers, clockCta } = data;
	const textData = {
		heading: clockHeading,
		paragraph: clockParagraph,
		offers: clockOffers,
		cta: clockCta,
	};

	return (
		<div
			className="p-design__why-block"
			style={{
				'--cr-primary': `var(--cr-${color}-d)`,
			}}
		>
			<WhyText data={textData} color={color} />
		</div>
	);
};

const ToggleBlock = ({ data, color }) => {
	const { toggleHeading, toggleParagraph, toggleOffers, toggleCta } = data;
	const textData = {
		heading: toggleHeading,
		paragraph: toggleParagraph,
		offers: toggleOffers,
		cta: toggleCta,
	};

	return (
		<div
			className="p-design__why-block"
			style={{ '--cr-primary': `var(--cr-${color}-d)` }}
		>
			<WhyText data={textData} color={color} />
		</div>
	);
};

export default function SectionWhy({ data }) {
	const { whyHeading, whyParagraph } = data;
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
			{isTabletScreen ? (
				<Carousel className="p-design__why__list" gap={'5vw'} isShowDots={true}>
					<ClockBlock data={data} />
					<MasksBlock data={data} />
					<ToggleBlock data={data} />
				</Carousel>
			) : (
				<div className="p-design__why__list">
					<ClockBlock data={data} />
					<MasksBlock data={data} />
					<ToggleBlock data={data} />
				</div>
			)}
		</section>
	);
}
