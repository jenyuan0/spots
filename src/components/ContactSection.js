'use client';

import React, { useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import Img from '@/components/Image';
import Link from '@/components/CustomLink';
import Accordion from '@/components/Accordions/Accordion';
import CustomPortableText from '@/components/CustomPortableText';
import CustomForm from '@/components/CustomForm';
import { springConfig } from '@/lib/helpers';

const SCROLL_ANIMATION_CONFIG = {
	start: ['start end', 'start start'],
	scale: [0.9, 1],
};

export function PlanForm({
	data,
	isH1,
	isH1Style,
	title,
	heading,
	successMessage,
	errorMessage,
}) {
	const { email, whatsapp, line } = data;
	const formTitle = title || data.formTitle;
	const formHeading = heading || data.formHeading;
	const formData = {
		...data,
		...(successMessage ? { successMessage: successMessage } : {}),
		...(errorMessage ? { errorMessage: errorMessage } : {}),
	};

	return (
		<div className="g-plan__form">
			<div className="g-plan__form__header wysiwyg">
				{isH1 ? (
					<>
						<h1 className="t-b-1">{formTitle}</h1>
						<h2 className={`t-h-${isH1Style ? '1' : '2'}`}>{formHeading}</h2>
					</>
				) : (
					<>
						<h2 className="t-b-1">{formTitle}</h2>
						<h3 className={`t-h-${isH1Style ? '1' : '2'}`}>{formHeading}</h3>
					</>
				)}
			</div>
			<CustomForm data={formData} />
			<div className="g-plan__support">
				{email && (
					<Link className="g-plan__support-item" href={`mailto:${email}`}>
						<span className="t-l-1">Email</span>
						<span className="t-h-5">{email}</span>
					</Link>
				)}
				{whatsapp && (
					<Link
						className="g-plan__support-item t-l-1"
						href={`https://wa.me/${encodeURIComponent(whatsapp)}`}
						target="_blank"
					>
						<span className="t-l-1">WhatsApp</span>
						<span className="t-h-5">{whatsapp}</span>
					</Link>
				)}
				{line && (
					<Link
						className="g-plan__support-item t-l-1"
						href={`https://line.me/R/${encodeURIComponent(line)}`}
						target="_blank"
					>
						<span className="t-l-1">LINE</span>
						<span className="t-h-5">{line}</span>
					</Link>
				)}
			</div>
		</div>
	);
}

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

export function ContactSection({ data, isH1, isH1Style }) {
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
				<PlanForm data={data} isH1={isH1} isH1Style={isH1Style} />
				<div className="g-plan__faq">
					<h2 className="t-h-2">Frequently asked questions.</h2>
					<Faq faq={faq} />
				</div>
			</div>
		</section>
	);
}
