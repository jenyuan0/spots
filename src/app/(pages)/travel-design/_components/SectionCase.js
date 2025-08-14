'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import clsx from 'clsx';
import { getRandomInt } from '@/lib/helpers';
import Img from '@/components/Image';
import Button from '@/components/Button';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { springConfig } from '@/lib/helpers';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import useMagnify from '@/hooks/useMagnify';
import useKey from '@/hooks/useKey';

export default function SectionCase({ data }) {
	const { caseHeading, caseItems } = data || {};
	const { isTouchDevice, width, height } = useWindowDimensions();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Pre-compute randomized motion/size/ timing for each image so it stays stable per render
	const seeds = useMemo(() => {
		return (caseItems || []).map((item) => {
			const count = Math.min(item?.thumbs?.length || 0, 4);
			return Array.from({ length: count }).map(() => ({
				rot: getRandomInt(-5, 5),
				delay: getRandomInt(0, 10) / 100,
				dur: getRandomInt(6, 12) / 10,
			}));
		});
	}, [caseItems]);

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
		mvX.set(e.clientX + 20);
		mvY.set(e.clientY);
		scale.set(1);
	};
	const onItemLeave = () => {
		hoverIndexRef.current = null;
		setCtaVisible(false);
		// spring out
		scale.set(0);
	};
	const onItemMove = (e) => {
		mvX.set(e.clientX + 20);
		mvY.set(e.clientY);
	};

	const setMag = useMagnify((state) => state.setMag);
	const { hasPressedKeys } = useKey();

	const handleDetailsClick = (e, slug) => {
		if (!hasPressedKeys) {
			e.preventDefault();
			setMag({
				slug,
				type: 'case',
			});
		}
	};

	if (!isMounted || !caseItems) return false;

	return (
		<section className="p-design__case" ref={sectionRef}>
			<div className="p-design__case__header">
				<h2 className="t-l-2 p-design__case__heading">{caseHeading}</h2>
			</div>
			<div className="p-design__case__list">
				{caseItems?.map((el, i) => {
					let slug = el.slug;
					let color = el?.color.title || 'red';
					return (
						<button
							key={i}
							ref={(el) => (itemRefs.current[i] = el)}
							onMouseEnter={(e) => onItemEnter(e, color, i)}
							onMouseLeave={onItemLeave}
							onMouseMove={onItemMove}
							onClick={(e) => {
								handleDetailsClick(e, slug);
							}}
							style={{ '--cr-primary': `var(--cr-${color}-d)` }}
							className={'p-design__case__card'}
						>
							<h3 className="p-design__case__card__title t-h-3">{el.title}</h3>
							<p className="p-design__case__card__subtitle t-b-2">
								{el.subtitle}
							</p>
							{el.thumbs && el.thumbs.length > 0 && (
								<div className={'p-design__case__card__images'}>
									{(() => {
										const count =
											seeds[i]?.length || Math.min(el?.thumbs?.length || 0, 4);
										const thumbs = (el?.thumbs || []).slice(0, count);
										return thumbs.map((img, j) => {
											const s = seeds[i]?.[j] || { rot: 0, dur: 0.6 };
											return (
												<span
													className="p-design__case__card__img"
													key={j}
													style={{
														'--index': j,
														'--rot': `${s.rot}deg`,
														'--dur': `${0.4 + j * 0.1}s`,
													}}
												>
													<Img image={img} />
												</span>
											);
										});
									})()}
								</div>
							)}
						</button>
					);
				})}
			</div>
			<motion.div
				className={clsx('p-design__case__cta', {
					'is-visible': !isTouchDevice && ctaVisible,
				})}
				style={{ x: springX, y: springY, scale }}
			>
				<Button className={clsx('btn', `cr-${ctaColor}-d`)}>
					Explore Case Study
				</Button>
			</motion.div>
		</section>
	);
}
