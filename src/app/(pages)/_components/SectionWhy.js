'use client';

import React, { useRef, useState, useEffect } from 'react';
import Button from '@/components/Button';
import { springConfig } from '@/lib/helpers';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export default function SectionWhy({ data }) {
	const { whyList, whyListHeading } = data;
	const ref = useRef(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start end', 'end start'],
	});
	const motionRotate = useTransform(scrollYProgress, [0, 1], [-20, -300]);
	const springRotate = useSpring(motionRotate, springConfig);

	return (
		<motion.section ref={ref} className="p-booking__why">
			<div className="p-booking__why__border-radius" />
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
				{whyList.map((el) => (
					<div className="p-booking__why__lists-item" key={el.title}>
						<div className="p-booking__why__lists-icon">{el.img}</div>
						<h3 className="t-h-4">{el.title}</h3>
						<p class="t-b-1">{el.paragraph}</p>
					</div>
				))}
				<Button
					className={'p-booking__why__lists-cta btn-outline cr-white'}
					href={'#link'}
					caret="right"
				>
					Run Free Search
				</Button>
			</div>
		</motion.section>
	);
}
