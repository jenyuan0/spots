'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { springConfig, scrollEnable, scrollDisable } from '@/lib/helpers';
import clsx from 'clsx';
import Link from '@/components/CustomLink';
import Img from '@/components/Image';
import Accordion from '@/components/Accordions/Accordion';
import CustomPortableText from '@/components/CustomPortableText';
import PlanForm from '@/components/PlanForm';
import Button from '@/components/Button';
import { IconEmail, IconWhatsApp, IconLine } from './SvgIcons';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';
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
				className="g-plan__faq__toggle"
				onClick={() => {
					setIsOpen(!isOpen);
					isOpen ? scrollEnable() : scrollDisable();
				}}
			>
				<div className=" btn-underline cr-green-d">
					{!isOpen ? 'Have questions? See our FAQ' : 'Close FAQ'}
				</div>
			</Button>
			<h3 className="g-plan__faq__title t-h-4">Frequently asked questions</h3>
			<div className="g-plan__faq__content">
				{faq?.map((item, index) => (
					<Accordion
						key={`faq-${index}`}
						title={item.title}
						isActive={activeAccordion === index}
						isCaret={true}
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

export default function PlanSection({
	data,
	isH1 = false,
	isH1Style,
	budget,
	hiddenFields,
}) {
	const { image, mobileImage, faq, email, whatsapp, line } = data;
	const containerRef = useRef(null);
	const [inViewRef, inView] = useInView({
		rootMargin: '-100% 0% 0% 0%',
	});

	const springAnimation = useScaleAnimation(containerRef);
	const { isMobileScreen } = useWindowDimensions();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

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
					style={{
						scale: isMounted && !isMobileScreen ? springAnimation : undefined,
					}}
				>
					<div className="object-fit">
						<Img image={image} responsiveImage={mobileImage} />
					</div>
				</motion.div>
			)}

			<div className="g-plan__container">
				<PlanForm
					data={data}
					isH1={isH1}
					isH1Style={isH1Style}
					budget={budget}
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
