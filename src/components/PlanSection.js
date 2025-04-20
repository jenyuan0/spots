'use client';

import React, { useState } from 'react';
import Link from '@/components/CustomLink';
import Img from '@/components/Image';
import Accordion from '@/components/Accordions/Accordion';
import CustomPortableText from '@/components/CustomPortableText';
import PlanForm from '@/components/PlanForm';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
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
	const { image, faq, email, whatsapp, line } = data;
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
				<PlanForm data={data} isH1={isH1} isH1Style={isH1Style} />
				<div className="g-plan__support">
					<div className="g-plan__contact">
						<h3 className="g-plan__contact__title t-h-4">Contact us</h3>
						<div className="g-plan__contact-items">
							{email && (
								<Link className="g-plan__contact-item" href={`mailto:${email}`}>
									<span className="t-l-2">Email</span>
									<span className="t-h-5">{email}</span>
								</Link>
							)}
							{whatsapp && (
								<Link
									className="g-plan__contact-item t-l-1"
									href={`https://wa.me/${encodeURIComponent(whatsapp)}`}
									isNewTab={true}
								>
									<span className="t-l-2">WhatsApp</span>
									<span className="t-h-5">{whatsapp}</span>
								</Link>
							)}
							{line && (
								<Link
									className="g-plan__contact-item t-l-1"
									href={`https://line.me/R/${encodeURIComponent(line)}`}
									isNewTab={true}
								>
									<span className="t-l-2">LINE</span>
									<span className="t-h-5">{line}</span>
								</Link>
							)}
						</div>
					</div>
					<div className="g-plan__faq">
						<h3 className="g-plan__faq__title t-h-4">
							Frequently asked questions.
						</h3>
						<Faq faq={faq} />
					</div>
				</div>
			</div>
		</section>
	);
}
