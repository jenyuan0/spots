import React, { useState } from 'react';
import Accordion from '@/components/Accordions/Accordion';
import CustomPortableText from '@/components/CustomPortableText';

export default function AccordionList({ data = {}, closeSiblings = false }) {
	const { items } = data || {};
	const [activeAccordion, setActiveAccordion] = useState(null);

	const handleAccordionToggle = (index) => {
		if (closeSiblings) {
			setActiveAccordion(activeAccordion === index ? null : index);
		}
	};

	return (
		<div className="accordion-list">
			{items.map((accordion, index) => {
				return (
					<Accordion
						key={index}
						title={accordion.title}
						isActive={closeSiblings && activeAccordion === index}
						onHandleToggle={() => handleAccordionToggle(index)}
					>
						<CustomPortableText blocks={accordion.content} />
					</Accordion>
				);
			})}
		</div>
	);
}
