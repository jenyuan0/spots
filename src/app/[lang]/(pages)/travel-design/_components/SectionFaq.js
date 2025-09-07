'use client';

import React, { useState } from 'react';
import Accordion from '@/components/Accordions/Accordion';
import CustomPortableText from '@/components/CustomPortableText';
import { formatPad } from '@/lib/helpers';

export default function SectionFaq({ data }) {
	const { faqHeading, faqSubheading, faq } = data;
	const [activeAccordion, setActiveAccordion] = useState(null);

	const handleAccordionToggle = (index) => {
		setActiveAccordion(activeAccordion === index ? null : index);
	};

	return (
		<section className={'p-design__faq'}>
			<div className="p-design__faq__header wysiwyg">
				{faqHeading && <h2 className="t-h-2">{faqHeading}</h2>}
				{faqSubheading && <p className="t-h-4">{faqSubheading}</p>}
			</div>
			<div className="p-design__faq__body">
				{faq?.map((item, index) => (
					<Accordion
						key={`faq-${index}`}
						subtitle={formatPad(index + 1)}
						title={item.title}
						isCaret={true}
						isActive={activeAccordion === index}
						onHandleToggle={() => handleAccordionToggle(index)}
					>
						<div className="wysiwyg-page">
							<CustomPortableText blocks={item.answer} />
						</div>
					</Accordion>
				))}
			</div>
		</section>
	);
}
