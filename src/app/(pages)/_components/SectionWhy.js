'use client';

import clsx from 'clsx';
import React, { useRef, useState, useEffect } from 'react';
import Img from '@/components/Image';
import Button from '@/components/Button';
import useSearchHotel from '@/hooks/useSearchHotel';
import { springConfig } from '@/lib/helpers';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

function ListItem({ children }) {
	const { ref, inView } = useInView({
		rootMargin: '0% 0px -20% 0px',
		triggerOnce: true,
	});

	return (
		<div
			ref={ref}
			className={clsx('p-booking__why__lists-item', {
				'is-in-view': inView,
			})}
		>
			{children}
		</div>
	);
}

export default function SectionWhy({ data }) {
	const { whyList, whyListHeading } = data;
	const { setSearchHotelActive } = useSearchHotel();
	const ref = useRef(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start end', 'end start'],
	});
	const motionRotate = useTransform(scrollYProgress, [0, 1], [0, -300]);
	const springRotate = useSpring(motionRotate, springConfig);
	const motionWidth = useTransform(scrollYProgress, [0, 1], [120, 200]);
	const springWidth = useSpring(motionWidth, springConfig);

	return (
		<motion.section ref={ref} className="p-booking__why">
			<motion.div
				className="p-booking__why__border-radius"
				style={{
					width: useTransform(springWidth, (val) => `${val}%`),
				}}
			/>
			<h2 className="screen-reader-only">{whyListHeading}</h2>
			<div className="p-booking__why__heading t-h-3" aria-hidden="true">
				<motion.svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 434.39 434.37"
					style={{
						transform: useTransform(springRotate, (val) => `rotate(${val}deg)`),
					}}
				>
					<defs>
						<path id="circlePath" d="M217.2,50a168,168 0 1,1 -0.1,0" />
					</defs>
					<text className="p-booking__why__heading__text">
						<textPath href="#circlePath" startOffset="0%">
							{whyListHeading}
						</textPath>
					</text>
				</motion.svg>
			</div>
			<div className="p-booking__why__lists">
				{whyList.map((el, index) => (
					<ListItem key={index}>
						<div className="p-booking__why__lists-icon">
							<span className="p-booking__why__lists-icon__img object-contain">
								<Img image={el.img} />
							</span>
							<span className="p-booking__why__lists-icon__num">
								{index + 1}
							</span>
						</div>
						<h3 className="t-h-4">{el.title}</h3>
						<p className="t-b-1">{el.paragraph}</p>
					</ListItem>
				))}
				<ListItem>
					<Button
						className={
							'p-booking__why__lists-cta btn-outline cr-white js-search-trigger'
						}
						caret="right"
						onClick={() => setSearchHotelActive(true)}
					>
						Start Your Search
					</Button>
				</ListItem>
			</div>
		</motion.section>
	);
}
