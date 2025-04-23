'use client';

import React, { useState, useCallback, useRef } from 'react';
import clsx from 'clsx';
import Link from '@/components/CustomLink';
import Img from '@/components/Image';
import Accordion from '@/components/Accordions/Accordion';
import CustomPortableText from '@/components/CustomPortableText';
import PlanForm from '@/components/PlanForm';
import Button from '@/components/Button';
import { IconEmail, IconWhatsApp, IconLine } from './SvgIcons';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
import { springConfig } from '@/lib/helpers';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { useInView } from 'react-intersection-observer';

const useScaleAnimation = (ref) => {
	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ['start end', 'start start'],
	});

	return useSpring(
		useTransform(scrollYProgress, [0, 1], [0.95, 1]),
		springConfig
	);
};

const ContactLink = ({ type, value }) => {
	const linkProps = {
		email: {
			href: `mailto:${value}`,
			icon: <IconEmail />,
			className: 'g-plan__contact-item',
		},
		whatsapp: {
			href: `https://wa.me/${encodeURIComponent(value)}`,
			icon: <IconWhatsApp />,
			className: 'g-plan__contact-item t-l-1',
		},
		line: {
			href: `https://line.me/R/${encodeURIComponent(value)}`,
			icon: <IconLine />,
			className: 'g-plan__contact-item t-l-1',
		},
	}[type];

	return (
		<Link
			className={linkProps.className}
			href={linkProps.href}
			isNewTab={type !== 'email'}
		>
			<span className="t-l-2">{type}</span>
			<span className="g-plan__contact-inline t-h-5">{value}</span>
			{linkProps.icon}
		</Link>
	);
};

const ContactItems = ({ email, whatsapp, line }) => (
	<div className="g-plan__contact-items">
		{email && <ContactLink type="email" value={email} />}
		{whatsapp && <ContactLink type="whatsapp" value={whatsapp} />}
		{line && <ContactLink type="line" value={line} />}
	</div>
);

function Faq({ faq, isInView }) {
	const [activeAccordion, setActiveAccordion] = useState(null);
	const [isOpen, setIsOpen] = useState(false);

	const handleAccordionToggle = (index) => {
		setActiveAccordion(activeAccordion === index ? null : index);
	};

	return (
		<div
			className={clsx('g-plan__faq', {
				'is-open': isOpen,
				'is-in-view': isInView,
			})}
		>
			<Button
				className="g-plan__faq__toggle btn-underline cr-green-d"
				onClick={() => setIsOpen(!isOpen)}
			>
				{isOpen && <span className="icon-close" />}
				{!isOpen ? 'More questions? See our FAQ' : 'Close FAQ'}
			</Button>
			<h3 className="g-plan__faq__title t-h-4">Frequently asked questions</h3>
			<div className="g-plan__faq__content">
				{faq?.map((item, index) => (
					<Accordion
						key={`faq-${index}`}
						title={item.title}
						isActive={activeAccordion === index}
						onHandleToggle={() => handleAccordionToggle(index)}
					>
						<div className="wysiwyg-page">
							<CustomPortableText blocks={item.answer} />
						</div>
					</Accordion>
				))}
			</div>
		</div>
	);
}

export default function PlanSection({ data, isH1, isH1Style, hiddenFields }) {
	const { image, faq, email, whatsapp, line } = data;
	const containerRef = useRef(null);
	const [inViewRef, inView] = useInView({
		rootMargin: '-100% 0% 0% 0%',
	});

	const springAnimation = useScaleAnimation(containerRef);
	const { isMobileScreen } = useWindowDimensions();

	const setRefs = useCallback(
		(node) => {
			containerRef.current = node;
			inViewRef(node);
		},
		[inViewRef]
	);

	return (
		<section ref={setRefs} className="g-plan">
			{image && (
				<motion.div
					className="g-plan__image p-fill"
					style={{ scale: !isMobileScreen ? springAnimation : undefined }}
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
					hiddenFields={hiddenFields}
				/>
				<div className="g-plan__support">
					<div className="g-plan__contact">
						<h3 className="g-plan__contact__title t-h-4">Contact us</h3>
						<ContactItems email={email} whatsapp={whatsapp} line={line} />
					</div>
					<Faq faq={faq} isInView={inView} />
				</div>
			</div>
		</section>
	);
}
