'use client';

import React, { useEffect, useRef, useState } from 'react';
import Img from '@/components/Image';

export default function SectionHero({ data }) {
	const { heroImage, heroVideo } = data || {};
	const videoRef = useRef(null);
	const [isVideoActive, setIsVideoActive] = useState(false);

	useEffect(() => {
		if (!heroVideo?.url || !videoRef.current) return;
		// Try to play programmatically to detect autoplay availability
		const v = videoRef.current;
		const tryPlay = async () => {
			try {
				await v.play();
				// onPlay will set isVideoActive
			} catch (e) {
				// Autoplay blocked (e.g., iOS Low Power Mode). Keep image visible.
			}
		};
		tryPlay();
	}, [heroVideo?.url]);

	return (
		<section className="p-design__hero">
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
						onPlay={() => setIsVideoActive(true)}
						style={{
							visibility: isVideoActive ? 'visible' : 'hidden',
						}}
					/>
				)}
			</div>
		</section>
	);
}
