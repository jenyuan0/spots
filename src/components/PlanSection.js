'use client';

import React, { useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Img from '@/components/Image';
import Accordion from '@/components/Accordions/Accordion';
import CustomPortableText from '@/components/CustomPortableText';
import PlanForm from '@/components/PlanForm';
import { springConfig } from '@/lib/helpers';

const SCROLL_ANIMATION_CONFIG = {
	start: ['start end', 'start start'],
	scale: [0.95, 1],
};

export function Faq({ faq }) {
	const [activeAccordion, setActiveAccordion] = useState(null);
	const handleAccordionToggle = (index) => {
		setActiveAccordion(activeAccordion === index ? null : index);
	};

	return (
		<div className="g-plan__faq__content">
			{faq?.map((item, index) => (
				<Accordion
					key={`faq-${index}`}
					title={item.title}
					isActive={activeAccordion === index}
					onHandleToggle={() => handleAccordionToggle(index)}
				>
					<div className="wysiwyg-b-1">
						<CustomPortableText blocks={item.answer} />
					</div>
				</Accordion>
			))}
		</div>
	);
}

export default function PlanSection({ data, isH1, isH1Style }) {
	const { image, faq } = data;
	const containerRef = React.useRef(null);
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: SCROLL_ANIMATION_CONFIG.start,
	});
	const scaleProgress = useTransform(
		scrollYProgress,
		[0, 1],
		SCROLL_ANIMATION_CONFIG.scale
	);
	const springAnimation = useSpring(scaleProgress, springConfig);

	return (
		<section ref={containerRef} className="g-plan">
			{image && (
				<motion.div
					className="g-plan__image p-fill"
					style={{ scale: springAnimation }}
				>
					<div className="object-fit">
						<Img image={image} />
					</div>
				</motion.div>
			)}

			<div className="g-plan__container">
				<PlanForm
					data={data}
					isH1={isH1}
					isH1Style={isH1Style}
					showSupport={true}
				/>
				<div className="g-plan__faq">
					<h2 className="t-h-2">Frequently asked questions.</h2>
					<Faq faq={faq} />
				</div>
			</div>
		</section>
	);
}
