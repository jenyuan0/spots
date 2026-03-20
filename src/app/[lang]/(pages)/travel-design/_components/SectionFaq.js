'use client';

import React, { useState } from 'react';
import Accordion from '@/components/Accordions/Accordion';
import CustomPortableText from '@/components/CustomPortableText';
import { formatPad } from '@/lib/helpers';

export default function SectionFaq({ data }) {
	const { faqHeading, faqSubheading, faq } = data;
	const [activeAccordion, setActiveAccordion] = useState(null);
	let visibleIndex = 0;

	return (
		<section className={'p-design__faq'}>
			<div className="p-design__faq__header wysiwyg">
				{faqHeading && <h2 className="t-h-2">{faqHeading}</h2>}
				{faqSubheading && <p className="t-h-4">{faqSubheading}</p>}
			</div>
			<div className="p-design__faq__body">
				{faq?.map((item, index) => {
					const { _type, title, answer } = item;

					if (_type === 'sectionTitle') {
						visibleIndex = 0;

						return (
							<h3
								key={`faq-section-${index}`}
								className="p-design__faq__title t-h-4"
							>
								{title}
							</h3>
						);
					}

					const currentVisibleIndex = visibleIndex;
					visibleIndex += 1;

					return (
						<Accordion
							key={`faq-${index}`}
							subtitle={formatPad(currentVisibleIndex + 1)}
							title={title}
							isCaret={true}
							isActive={activeAccordion === index}
							onHandleToggle={() =>
								setActiveAccordion(activeAccordion === index ? null : index)
							}
						>
							<div className="wysiwyg-page">
								<CustomPortableText blocks={answer} />
							</div>
						</Accordion>
					);
				})}
			</div>
		</section>
	);
}
