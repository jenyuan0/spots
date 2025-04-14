'use client';

import React, { useRef } from 'react';
import Img from '@/components/Image';
import CustomForm from '@/components/CustomForm';
import Accordion from '@/components/Accordions/Accordion';
import CustomPortableText from '@/components/CustomPortableText';
import { IconWhatsApp, IconLine, IconEmail } from '@/components/SvgIcons';
import { springConfig } from '@/lib/helpers';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export default function ContactSection({ data }) {
	const { contactImage, planForm } = data;
	const { email, whatsapp, line, faq } = planForm;
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
			<div className="p-home__contact__container">
				<div className="p-home__contact__form">
					{planForm && <CustomForm data={planForm} />}
					<div className="p-home__contact__connect">
						<h2 className="t-h-3 p-home__contact__title">Or alternatively:</h2>
						<ul class="t-h-5">
							{email && (
								<li>
									<a href={`mailto:${email}`}>
										<IconEmail /> {email}
									</a>
								</li>
							)}
							{line && (
								<li>
									<a href={`https://line.me/R/${line}`}>
										<IconLine /> Line
									</a>
								</li>
							)}
							{whatsapp && (
								<li>
									<a href={`https://wa.me/${whatsapp}`}>
										<IconWhatsApp /> WhatsApp
									</a>
								</li>
							)}
						</ul>
					</div>
				</div>
				<div className="p-home__contact__divider" />
				<div className="p-home__contact__faq">
					<h2 className="p-home__contact__title t-h-1">FAQ</h2>
					{faq?.map((item, index) => (
						<Accordion key={`faq-${index}`} title={item.title}>
							<div className="p-home__contact__faq__content wysiwyg-b-1">
								<CustomPortableText blocks={item.answer} />
							</div>
						</Accordion>
					))}
				</div>
			</div>
		</section>
	);
}
