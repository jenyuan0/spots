'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import clsx from 'clsx';
import { getRandomInt } from '@/lib/helpers';
import CustomPortableText from '@/components/CustomPortableText';
import Button from '@/components/Button';
import Link from '@/components/CustomLink';

export default function SectionCase({ data }) {
	const d = {
		title: 'Plan for',
		list: [
			{
				title: 'Family Reunion',
				subtitle: 'Multigenerational, beautifully handled',
				images: ['', '', '', ''],
			},
			{
				title: 'Corporate Offsites',
				subtitle: 'Not a trip, but reorientation',
				images: ['', '', '', ''],
			},
			{
				title: 'Design-Lovers',
				subtitle: 'Seasonal slow down',
				images: ['', '', '', ''],
			},
			{
				title: 'The Romantic Reset',
				subtitle: 'Couples trip done right',
				images: ['', '', '', ''],
			},
			{
				title: 'Summer Escape',
				subtitle: 'Couples trip done right',
				images: ['', '', '', ''],
			},
		],
	};
	const { title, list } = d || {};
	const palette = ['red', 'blue', 'orange', 'purple', 'green'];

	// Pre-compute randomized motion/size/ timing for each image so it stays stable per render
	const seeds = useMemo(() => {
		return (list || []).map(() =>
			Array.from({ length: 4 }).map(() => ({
				rot: getRandomInt(-10, 10),
				delay: getRandomInt(0, 0.25),
				dur: getRandomInt(0.9, 1.6),
			}))
		);
	}, [list?.length]);

	const itemRefs = useRef([]);
	const lastActiveRef = useRef(null);
	const [activeIndex, setActiveIndex] = useState(null);

	useEffect(() => {
		const handleScroll = () => {
			const titleOffset = window.innerHeight * 0.4 + 120 / 2;

			itemRefs.current.forEach((el, i) => {
				if (!el) return;
				const rect = el.getBoundingClientRect();
				const top = rect.top;
				const bottom = rect.bottom;

				if (top <= titleOffset && bottom >= titleOffset) {
					if (i !== lastActiveRef.current) {
						lastActiveRef.current = i;
						setActiveIndex(i);
					}
				}
			});
		};

		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<section className="p-design__case">
			<div className="p-design__case__header">
				<h2 className="t-h-1">{title}</h2>
				<div className="t-h-4">​</div>
			</div>
			<div className="p-design__case__list">
				{list?.map((el, i) => {
					const color = palette[i % palette.length];
					return (
						<button
							key={i}
							ref={(el) => (itemRefs.current[i] = el)}
							style={{ '--cr-primary': `var(--cr-${color}-d)` }}
							className={clsx('p-design__case__list-item', {
								'is-active': i === activeIndex,
							})}
						>
							<div className="p-design__case__list-item__title">
								{Array.isArray(el.images) && el.images.length > 0 && (
									<div className={'p-design__case__list-item__images'}>
										{(seeds[i] || []).map((s, j) => (
											<span
												className="p-design__case__list-item__img"
												key={j}
												style={{
													'--index': j,
													'--rot': `${s.rot}deg`,
													'--delay': `${s.delay}s`,
													'--dur': `${s.dur}s`,
												}}
											></span>
										))}
									</div>
								)}
								<h3 className="t-h-1">{el.title}</h3>
								<Button
									className={clsx('p-design__case__list-item__cta btn', {
										[`cr-${color}-d`]: i === activeIndex,
									})}
								>
									View Case Study
								</Button>
							</div>
							<p className="t-h-4">{el.subtitle}</p>
						</button>
					);
				})}
			</div>
		</section>
	);
}
