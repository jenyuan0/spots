'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import clsx from 'clsx';
import { colorArray, getRandomInt } from '@/lib/helpers';
import Img from '@/components/Image';
import CustomPortableText from '@/components/CustomPortableText';
import useMagnify from '@/hooks/useMagnify';
import useKey from '@/hooks/useKey';
import Link from '@/components/CustomLink';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

// Spot component for individual animated dots
function HeroSpot({ index, data, scrollYProgress }) {
	const [dot, setDot] = useState({
		x: 1000,
		y: 1000,
	});
	const [screen, setScreen] = useState({ x: 0, y: 0 });
	const setMag = useMagnify((state) => state.setMag);
	const { hasPressedKeys } = useKey();

	useEffect(() => {
		const randomColor = colorArray();

		setDot({
			color: randomColor[0] || 'green',
			lightOrDark: Math.random() < 0.5 ? 'l' : 'd',
			x: data?.x,
			y: data?.y,
			slug: data.slug,
		});

		setScreen({
			x: window.innerWidth / 2,
			y: window.innerHeight / 2,
			height: window.innerHeight,
		});
	}, [data]);

	// Create motion values outside of the render
	const motionX = useTransform(
		scrollYProgress,
		[
			0,
			...Array.from({ length: 3 }, () => getRandomInt(1, 149) * 0.001).sort(),
			0.15,
			0.3,
			0.8,
			1,
		],
		[
			dot.x,
			dot.x + getRandomInt(5, 25),
			dot.x - getRandomInt(5, 25),
			dot.x + getRandomInt(5, 25),
			screen.x,
			screen.x,
			screen.x,
			screen.x + (index % 2 === 0 ? 1 : -1) * getRandomInt(200, 400),
		]
	);

	const motionY = useTransform(
		scrollYProgress,
		[
			0,
			...Array.from({ length: 3 }, () => getRandomInt(1, 149) * 0.001).sort(),
			0.15,
			0.3,
			0.8,
			1,
		],
		[
			dot.y,
			dot.y + getRandomInt(5, 25),
			dot.y - getRandomInt(5, 25),
			dot.y + getRandomInt(5, 25),
			screen.height - getRandomInt(20, screen.height / 2),
			screen.height + 70,
			screen.height + 70,
			screen.height + (Math.random() * 800 - 200),
		]
	);

	const motionOpacity = useTransform(
		scrollYProgress,
		[0, 0.5, 0.9, getRandomInt(91, 99) * 0.01, 1],
		[1, 1, 1, 0, 0]
	);

	const motionScale = useTransform(
		scrollYProgress,
		[0, 0.15, 1],
		[1, 0.2, 0.2]
	);

	const springConfig = {
		stiffness: 200,
		damping: 30,
		mass: 0.5,
	};

	const springX = useSpring(motionX, springConfig);
	const springY = useSpring(motionY, springConfig);
	const springScale = useSpring(motionScale, springConfig);

	if (dot) {
		return (
			<motion.div
				className={'p-home__spot'}
				style={{
					'--cr-primary': `var(--cr-${dot.color}-${dot.lightOrDark})`,
					x: springX,
					y: springY,
					scale: springScale,
					opacity: motionOpacity,
				}}
			>
				<Link
					className={'p-home__spot__link'}
					href={`/locations/${dot.slug}`}
					{...(!hasPressedKeys && {
						onClick: (e) => {
							e.preventDefault();
							setMag({
								slug: dot.slug,
								type: 'location',
								color: dot.color,
							});
						},
					})}
				/>
			</motion.div>
		);
	}
}

// Separate component for highlights to avoid hook issues
const HighlightItem = ({ scrollYProgress, index, springConfig, el }) => {
	const opacityTransform = useTransform(
		scrollYProgress,
		[0, 0.2 + index * 0.18],
		[0, 1]
	);
	const rotateTransform = useTransform(
		scrollYProgress,
		[0, 0.2 + index * 0.18],
		[0, '360deg * 0.3']
	);

	const opacity = useSpring(opacityTransform, springConfig);
	const rotate = useSpring(rotateTransform, springConfig);

	return (
		<motion.div
			key={index}
			className="p-home__highlights__item"
			initial={{ opacity: 0, rotate: '-10deg' }}
			style={{
				opacity,
				rotate,
			}}
		>
			<div className="p-home__highlights__rotate p-fill">
				<span className="object-fit">
					<Img image={el} />
				</span>
			</div>
		</motion.div>
	);
};

function Highlights({ highlights }) {
	const ref = useRef(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start 50%', 'end end'],
	});

	const springConfig = useMemo(
		() => ({
			stiffness: 200,
			damping: 30,
			mass: 0.5,
		}),
		[]
	);

	return (
		<section ref={ref} className="p-home__highlights g g-3">
			{highlights?.map((el, index) => (
				<HighlightItem
					key={index}
					scrollYProgress={scrollYProgress}
					index={index}
					springConfig={springConfig}
					el={el}
				/>
			))}
		</section>
	);
}

export default function PageHome({ data }) {
	const {
		heroHeading,
		heroImage,
		heroSpots,
		introTitle,
		introHeading,
		introCta,
		highlights,
	} = data || {};
	const heroRef = useRef(null);
	const { scrollYProgress } = useScroll({
		target: heroRef,
		offset: ['start start', 'end start'],
	});

	const [positions, setPositions] = useState([]);
	// Function to check for overlaps
	const checkOverlap = (x, y, existingPositions) => {
		const minDistance = 120;
		const centerY = window.innerHeight / 2;
		const isCenterArea = y > centerY - 80 && y < centerY + 80;
		const hasOverlap = existingPositions.some((pos) => {
			const dx = pos.x - x;
			const dy = pos.y - y;
			return Math.sqrt(dx * dx + dy * dy) < minDistance;
		});

		return hasOverlap || isCenterArea;
	};

	// Generate all positions first
	useEffect(() => {
		const padding = Math.max(window.innerWidth * 0.2, 300);
		const newPositions = [];

		heroSpots?.forEach(() => {
			let validPosition = false;
			let attempts = 0;
			let x, y;

			while (!validPosition && attempts < 10) {
				x = Math.random() * (window.innerWidth - padding * 2) + padding;
				y = Math.random() * (window.innerHeight - padding * 2) + padding;

				if (!checkOverlap(x, y, newPositions)) {
					validPosition = true;
					newPositions.push({ x, y });
				}
				attempts++;
			}
		});

		setPositions(newPositions);
	}, [heroSpots]);

	return (
		<>
			<section ref={heroRef} className="p-home__hero">
				<div className="p-home__hero__image p-fill">
					<span className="object-fit">
						{heroImage && <Img image={heroImage} />}
					</span>
				</div>
				{heroHeading && (
					<h1 className="p-home__hero__heading t-h-1">
						<CustomPortableText blocks={heroHeading} hasPTag={false} />
					</h1>
				)}
				{heroSpots &&
					positions.length &&
					heroSpots.map((el, i) => (
						<HeroSpot
							key={`spot-${i}`}
							index={i}
							data={{ ...el, x: positions[i]?.x, y: positions[i]?.y }}
							scrollYProgress={scrollYProgress}
						/>
					))}
			</section>
			<section className="p-home__intro wysiwyg">
				{introTitle && (
					<h2 className="p-home__intro__title t-l-1">{introTitle}</h2>
				)}
				{introHeading && (
					<p className="t-h-2">
						<CustomPortableText blocks={introHeading} hasPTag={false} />
					</p>
				)}
				{introCta && (
					<Link link={introCta?.link} isNewTab={introCta?.isNewTab}>
						{introCta.label}
					</Link>
				)}
			</section>

			<Highlights highlights={highlights} />

			<section className="p-home__hiw"></section>
		</>
	);
}
