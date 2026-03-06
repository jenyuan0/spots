'use client';

import React, { useEffect, useRef, useState } from 'react';
import Img from '@/components/Image';
import ImageHalftone from '@/components/ImageHalftone';
import { motion, useScroll, useTransform } from 'motion/react';
import Button from '@/components/Button';
import Link from '@/components/CustomLink';
import useMagnify from '@/hooks/useMagnify';
import useKey from '@/hooks/useKey';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { useCurrentLang } from '@/hooks/useCurrentLang';

function shuffleArray(arr) {
	const copy = [...arr];
	for (let i = copy.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[copy[i], copy[j]] = [copy[j], copy[i]];
	}
	return copy;
}

export default function SectionHero({ data }) {
	const { isMobileScreen } = useWindowDimensions();
	const [currentLanguageCode, currentLanguageCodeDisplay] = useCurrentLang();
	const { heroHeading, heroGallery, heroCtaLabel, heroCta } = data || {};
	const [hasMounted, setHasMounted] = useState(false);
	const ref = useRef();
	const { scrollY } = useScroll();
	const height = ref.current?.offsetHeight || 1000; // fallback value
	const progress = useTransform(scrollY, [0, height], [0, 1], {
		clamp: true,
	});
	const motionOpacity = useTransform(
		progress,
		[0, 0.6, isMobileScreen ? 0.61 : 0.75],
		[1, 1, 0]
	);
	const pointerEvents = useTransform(progress, (v) =>
		v < 1 ? 'auto' : 'none'
	);
	const { addMag } = useMagnify();
	const { hasPressedKeys } = useKey();

	const shuffledHeroGallery = React.useMemo(
		() => shuffleArray(heroGallery),
		[heroGallery]
	);

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
				pointerEvents,
			}}
		>
			{heroHeading && (
				<div className="p-design__hero__header">
					<h1>
						{heroHeading.split('\n').map((line, i) => (
							<React.Fragment key={i}>
								{line}
								{i < heroHeading.split('\n').length - 1 && <br />}
							</React.Fragment>
						))}
					</h1>
				</div>
			)}

			<div className="p-design__hero__gallery">
				{shuffledHeroGallery.slice(0, 9).map((el, index) => {
					const key = `${el._id || index}-${index}`;
					const { slug, title, color } = el;
					if (index > 8) {
						return false;
					}

					return (
						<Link
							key={key}
							className="p-design__hero__gallery-item"
							href={`/${currentLanguageCodeDisplay}/paris/locations/${slug}`}
							title={`View ${title}`}
							tabIndex={-1}
							{...(!hasPressedKeys && {
								onClick: (e) => {
									e.preventDefault();
									addMag({
										slug,
										type: 'location',
										color,
									});
								},
							})}
						>
							<Img image={el.images} />
							{/* <ImageHalftone image={el.images} /> */}
						</Link>
					);
				})}
			</div>
			<div className="p-design__hero__cta">
				{heroCtaLabel && <h2 className="t-b-2">{heroCtaLabel}</h2>}
				{heroCta?.map((el, index) => {
					const key = `${el._id || index}-${index}`;
					const { slug, title } = el;

					return (
						<Button
							key={key}
							className="btn-underline t-h-5"
							{...(!hasPressedKeys && {
								onClick: (e) => {
									e.preventDefault();
									addMag({
										slug,
										type: 'case',
									});
								},
							})}
						>
							{title}
						</Button>
					);
				})}
			</div>
		</motion.section>
	);
}
