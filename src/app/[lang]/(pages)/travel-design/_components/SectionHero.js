'use client';

import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Img from '@/components/Image';
import { motion, useScroll, useTransform } from 'motion/react';
import useWindowDimensions from '@/hooks/useWindowDimensions';

export default function SectionHero({ data }) {
	const { heroImage, heroVideo } = data || {};
	const videoRef = useRef(null);
	const ref = useRef();
	const [isVideoActive, setIsVideoActive] = useState(false);
	const { scrollY } = useScroll();
	const { isTabletScreen } = useWindowDimensions();
	const height = ref.current?.offsetHeight || 1000; // fallback value
	const progress = useTransform(
		scrollY,
		[0, height * (isTabletScreen ? 2 : 0.4)],
		[0, 1],
		{
			clamp: true,
		}
	);
	const motionOpacity = useTransform(progress, [0, 1], [1, 0]);
	const motionSCale = useTransform(progress, [0, 1], [1, 0.95]);
	const [hasMounted, setHasMounted] = useState(false);
	useEffect(() => {
		setHasMounted(true);
	}, []);

	if (!hasMounted) return null;

	return (
		<motion.section
			ref={ref}
			className="p-design__hero"
			style={{
				opacity: motionOpacity,
				scale: motionSCale,
			}}
		>
			<div className="object-fit">
				{heroImage && !isVideoActive && <Img image={heroImage} />}
				{heroVideo?.url && (
					<video
						ref={videoRef}
						src={heroVideo.url}
						muted
						playsInline
						loop
						preload="metadata"
						onLoadedMetadata={() => {
							const v = videoRef.current;
							if (v) v.play().catch(() => {});
						}}
						onPlay={() => setIsVideoActive(true)}
						className={clsx({
							'is-active': isVideoActive,
						})}
					/>
				)}
			</div>
		</motion.section>
	);
}
