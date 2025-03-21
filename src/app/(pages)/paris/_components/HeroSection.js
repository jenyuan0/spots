'use client';

import React from 'react';
import Img from '@/components/Image';
import CustomPortableText from '@/components/CustomPortableText';
import { motion, useSpring, useTransform } from 'framer-motion';
import Link from '@/components/CustomLink';

export default function HeroSection({ data }) {
	const { heroHeading, heroImages } = data;

	return (
		<section className="p-paris__hero">
			{heroHeading && (
				<h1 className="p-paris__hero__heading t-h-1">
					<CustomPortableText blocks={heroHeading} hasPTag={false} />
				</h1>
			)}

			<h2 className="p-paris__hero__subheading t-h-3">
				An ever-growing collection of Parisian treasures, refreshed weekly
			</h2>

			{/* TODO
			Figure out motif: https://www.fridges.market/ */}

			{/* <div className="p-paris__hero__motif">
				<div className="p-paris__hero__motif-interior g g-4">
					{heroImages?.map((el, index) => (
						<motion.div key={index} className="p-paris__hero__motif-item">
							<div className="p-paris__motif-rotate p-fill child-fit">
								<Img image={el} />
							</div>
						</motion.div>
					))}
				</div>
			</div> */}

			<div className="p-paris__hero__nav t-l-1">
				<Link href={'/paris/guides'}>Guides</Link>
				<Link href={'/paris/locations'}>Spots</Link>
			</div>
		</section>
	);
}
