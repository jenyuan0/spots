'use client';

import React, { useRef } from 'react';
import Img from '@/components/Image';
import CustomForm from '@/components/CustomForm';
import { springConfig } from '@/lib/helpers';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export default function ContactSection({ data }) {
	const { contactImage, planForm } = data;
	const ref = useRef(null);
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start end', 'start start'],
	});
	const motionScale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
	const springScale = useSpring(motionScale, springConfig);

	return (
		<section ref={ref} className="p-home__contact">
			<motion.div
				className={'p-home__contact__image p-fill'}
				style={{
					scale: springScale,
				}}
			>
				<div className="object-fit">
					{contactImage && <Img image={contactImage} />}
				</div>
			</motion.div>
			<div className={'p-home__contact__form'}>
				{planForm && <CustomForm data={planForm} />}
			</div>
		</section>
	);
}
