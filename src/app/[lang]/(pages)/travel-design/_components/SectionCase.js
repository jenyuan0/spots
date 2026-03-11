'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import clsx from 'clsx';
import Img from '@/components/Image';
import Button from '@/components/Button';
import Carousel from '@/components/Carousel';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { springConfig } from '@/lib/helpers';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import useMagnify from '@/hooks/useMagnify';
import useKey from '@/hooks/useKey';

const ItemBlock = ({
	data,
	index,
	onItemEnter,
	onItemLeave,
	onItemMove,
	handleDetailsClick,
	itemRef,
}) => {
	const { slug, title, color, thumbs } = data;
	const colorTitle = color?.title || 'brown';

	return (
		<button
			ref={itemRef}
			onMouseEnter={(e) => onItemEnter(e, colorTitle, index)}
			onMouseLeave={onItemLeave}
			onMouseMove={onItemMove}
			onClick={(e) => {
				handleDetailsClick(e, slug, title);
			}}
			style={{ '--cr-primary': `var(--cr-${colorTitle}-d)` }}
			className={'p-design__case__card'}
		>
			{thumbs && thumbs.length > 0 && (
				<div className={'p-design__case__card__thumb'}>
					<Img image={thumbs[0]} />
				</div>
			)}
			<h3 className="p-design__case__card__title t-h-5">{title}</h3>
		</button>
	);
};

export default function SectionCase({ data, siteData }) {
	const { caseHeading, caseParagraph, caseItems } = data || {};
	const { localization } = siteData || {};
	const { exploreCaseStudy } = localization || {};
	const { isTouchDevice, isTabletScreen, width, height } =
		useWindowDimensions();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const itemRefs = useRef([]);
	const sectionRef = useRef(null);
	const hoverIndexRef = useRef(null);

	// Floating CTA state
	const [ctaVisible, setCtaVisible] = useState(false);
	const [ctaColor, setCtaColor] = useState('red');

	// Framer Motion values for cursor-following CTA
	const mvX = useMotionValue(width / 2);
	const mvY = useMotionValue(height / 2);
	const springX = useSpring(mvX, springConfig);
	const springY = useSpring(mvY, springConfig);
	const scale = useSpring(0, springConfig);

	// Floating CTA handlers
	const onItemEnter = (e, colorName, index) => {
		hoverIndexRef.current = index;
		setCtaColor(colorName || 'brown');
		setCtaVisible(true);
		// position & spring in
		mvX.set(e.clientX - 167.5 / 2);
		mvY.set(e.clientY - 45 / 2);
		scale.set(1);
	};
	const onItemLeave = () => {
		hoverIndexRef.current = null;
		setCtaVisible(false);
		// spring out
		scale.set(0);
	};
	const onItemMove = (e) => {
		mvX.set(e.clientX - 167.5 / 2);
		mvY.set(e.clientY - 45 / 2);
	};

	const { addMag } = useMagnify();
	const { hasPressedKeys } = useKey();
	const handleDetailsClick = (e, slug, title) => {
		if (!hasPressedKeys) {
			e.preventDefault();
			addMag({
				slug,
				title,
				type: 'case',
			});
		}
	};

	if (!isMounted || !caseItems) return false;

	return (
		<section className="p-design__case" ref={sectionRef}>
			<h2 className="p-design__case__title t-l-2">{caseHeading}</h2>
			<p className="p-design__case__paragraph t-h-4">{caseParagraph}</p>
			{caseItems &&
				(isTabletScreen ? (
					<Carousel
						className="p-design__case__list"
						gap={0}
						isShowDots={true}
						isAutoHeight={false}
					>
						{caseItems.map((el, i) => {
							return (
								<ItemBlock
									key={i}
									data={el}
									index={i}
									onItemEnter={onItemEnter}
									onItemLeave={onItemLeave}
									onItemMove={onItemMove}
									handleDetailsClick={handleDetailsClick}
									itemRef={(node) => (itemRefs.current[i] = node)}
								/>
							);
						})}
					</Carousel>
				) : (
					<div className="p-design__case__list">
						{caseItems.map((el, i) => {
							return (
								<ItemBlock
									key={i}
									data={el}
									index={i}
									onItemEnter={onItemEnter}
									onItemLeave={onItemLeave}
									onItemMove={onItemMove}
									handleDetailsClick={handleDetailsClick}
									itemRef={(node) => (itemRefs.current[i] = node)}
								/>
							);
						})}
					</div>
				))}
			{!isTouchDevice && (
				<motion.div
					className={clsx('p-design__case__cta', {
						'is-visible': ctaVisible,
					})}
					style={{ x: springX, y: springY, scale }}
				>
					<Button className={clsx('btn', `cr-${ctaColor}-d`)}>
						{exploreCaseStudy || 'Explore Case Study'}
					</Button>
				</motion.div>
			)}
		</section>
	);
}
