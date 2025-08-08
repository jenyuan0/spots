'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import clsx from 'clsx';
import { getRandomInt } from '@/lib/helpers';
import Img from '@/components/Image';
import Button from '@/components/Button';

export default function SectionCase({ data }) {
	const { caseHeading, caseItems } = data || {};
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
	const [activeIndex, setActiveIndex] = useState(null);

	useEffect(() => {
		const handleScroll = () => {
			// Alignment line for ALL items (matches sticky title at ~40% from top)
			const targetY = window.innerHeight * 0.5;
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

	return (
		<section className="p-design__case" ref={sectionRef}>
			<div className="p-design__case__header">
				<h2 className="t-h-1">{caseHeading}</h2>
				<div className="t-h-5">​</div>
			</div>
			<div className="p-design__case__list">
				{caseItems?.map((el, i) => {
					let color = el?.color.title || 'red';

					return (
						<div
							key={i}
							ref={(el) => (itemRefs.current[i] = el)}
							style={{ '--cr-primary': `var(--cr-${color}-d)` }}
							className={clsx('p-design__case__list-item', {
								'is-active': i === activeIndex,
							})}
						>
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
												// '--delay': `${s.delay}s`,
												'--dur': `${0.4 + j * 0.1}s`,
											}}
										>
											<Img image={el?.thumbs?.[j] || el?.thumbs?.[0]} />
										</span>
									))}
								</div>
							)}
							<div className="p-design__case__list-item__title">
								<h3 className="t-h-1">{el.title}</h3>
								<Button
									className={clsx('p-design__case__list-item__cta btn', {
										[`cr-${color}-d`]: i === activeIndex,
									})}
								>
									View Case Study
								</Button>
							</div>
							<p className="t-h-5">{el.subtitle}</p>
						</div>
					);
				})}
			</div>
		</section>
	);
}
