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
	const [showFallbackImage, setShowFallbackImage] = useState(!heroVideo?.url);
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
		if (!hasMounted) return;

		if (!heroVideo?.url) {
			setShowFallbackImage(!!heroImage);
			return;
		}

		const v = videoRef.current;
		if (!v) return;

		setShowFallbackImage(false);

		const tryPlay = async () => {
			try {
				await v.play();
			} catch {
				setShowFallbackImage(true);
				v.pause();
			}
		};

		if (v.readyState >= 2) {
			tryPlay();
		} else {
			const onCanPlay = () => {
				tryPlay();
				v.removeEventListener('canplay', onCanPlay);
			};
			v.addEventListener('canplay', onCanPlay);
			return () => v.removeEventListener('canplay', onCanPlay);
		}
	}, [hasMounted, heroVideo?.url, heroImage]);

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
				{heroImage && showFallbackImage && <Img image={heroImage} />}
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
							if (v)
								v.play().catch(() => {
									setShowFallbackImage(true);
								});
						}}
						onError={() => setShowFallbackImage(true)}
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
