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
	const { width, height } = useWindowDimensions();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	// Pre-compute randomized motion/size/ timing for each image so it stays stable per render
	const seeds = useMemo(() => {
		return (caseItems || []).map(() =>
			Array.from({ length: 4 }).map(() => ({
				rot: getRandomInt(-10, 10),
				y: getRandomInt(-30, 30),
				delay: getRandomInt(0, 10) / 100,
				dur: getRandomInt(6, 12) / 10,
			}))
		);
	}, [caseItems?.length]);

	const itemRefs = useRef([]);
	const sectionRef = useRef(null);
	const lastActiveRef = useRef(null);
	const hoverIndexRef = useRef(null);
	const [activeIndex, setActiveIndex] = useState(null);

	// Floating CTA state
	const [ctaVisible, setCtaVisible] = useState(false);
	const [ctaColor, setCtaColor] = useState('red');

	// Framer Motion values for cursor-following CTA
	const mvX = useMotionValue(width / 2);
	const mvY = useMotionValue(height / 2);
	const springX = useSpring(mvX, springConfig);
	const springY = useSpring(mvY, springConfig);
	const scale = useSpring(0, springConfig);

	useEffect(() => {
		const handleScroll = () => {
			// Alignment line for ALL items (matches sticky title at ~40% from top)
			const targetY = window.innerHeight * 0.55;
			const firstActivateY = targetY;
			// Guard: last should deactivate once scrolled past ~15% from top
			const lastDeactivateY = window.innerHeight * 0.15;

			// If the entire section is out of view, clear the active state
			if (sectionRef.current) {
				const srect = sectionRef.current.getBoundingClientRect();
				if (srect.bottom < 0 || srect.top > window.innerHeight) {
					if (lastActiveRef.current !== null) {
						lastActiveRef.current = null;
						setActiveIndex(null);
					}
					return;
				}
			}

			const items = itemRefs.current.filter(Boolean);
			let nextActive = null;

			// Compute first/last rects once for guards
			const firstRect = items[0]?.getBoundingClientRect();
			const lastRect = items[items.length - 1]?.getBoundingClientRect();

			// Find the item that crosses the alignment line
			items.forEach((el, i) => {
				const rect = el.getBoundingClientRect();
				const isLast = i === items.length - 1;
				const crossesLine = rect.top <= targetY && rect.bottom >= targetY;
				const lastShouldStay = isLast && rect.top <= targetY; // once last crosses, keep it until the guard clears it

				if ((crossesLine || lastShouldStay) && nextActive === null) {
					nextActive = i;
				}
			});

			// Guard 1: do not activate anything until the FIRST item starts stick
			if (firstRect && firstRect.top > firstActivateY) {
				nextActive = null;
			}

			// Guard 2: once the LAST item has scrolled past ~15% from top, deactivate
			if (lastRect && lastRect.bottom < lastDeactivateY) {
				nextActive = null;
			}

			// Apply state
			if (nextActive !== lastActiveRef.current) {
				lastActiveRef.current = nextActive;
				setActiveIndex(nextActive);
			}
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		window.addEventListener('resize', handleScroll, { passive: true });
		handleScroll();

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('resize', handleScroll);
		};
	}, []);

	// Floating CTA handlers
	const onItemEnter = (e, colorName, index) => {
		hoverIndexRef.current = index;
		setCtaColor(colorName || 'brown');
		setCtaVisible(true);
		// position & spring in
		mvX.set(e.clientX + 20);
		mvY.set(e.clientY);
		scale.set(1);
		setActiveIndex(index);
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

	useEffect(() => {
		if (hoverIndexRef.current !== null) {
			const idx = hoverIndexRef.current;
			const item = caseItems?.[idx];
			const colorName = item?.color?.title || 'red';
			const isActive = idx === activeIndex;
			setCtaColor(isActive ? colorName : 'brown');
		}
	}, [activeIndex, caseItems]);

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

	if (!isMounted) return false;

	return (
		<section className="p-design__case" ref={sectionRef}>
			<div className="p-design__case__header">
				<h2 className="t-h-1">{caseHeading}</h2>
				<div className="t-b-1">​</div>
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
							className={clsx('p-design__case__list-item', {
								'is-active': i === activeIndex,
							})}
						>
							<h3 className="p-design__case__list-item__title t-h-1">
								{el.title}
							</h3>
							<p className="p-design__case__list-item__subtitle t-b-1">
								{el.subtitle}
							</p>
							{Array.isArray(el.thumbs) && el.thumbs.length > 0 && (
								<div className={'p-design__case__list-item__images'}>
									{(seeds[i] || []).map((s, j) => (
										<span
											className="p-design__case__list-item__img"
											key={j}
											style={{
												'--index': j,
												'--rot': `${s.rot}deg`,
												'--y': `${s.y}%`,
												'--dur': `${0.4 + j * 0.1}s`,
											}}
										>
											<Img image={el?.thumbs?.[j] || el?.thumbs?.[0]} />
										</span>
									))}
								</div>
							)}
						</button>
					);
				})}
			</div>
			<motion.div
				className={clsx('p-design__case__cta', { 'is-visible': ctaVisible })}
				style={{ x: springX, y: springY, scale }}
			>
				<Button className={clsx('btn', `cr-${ctaColor}-d`)}>
					View Case Study
				</Button>
			</motion.div>
		</section>
	);
}
