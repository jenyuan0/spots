'use client';

import React from 'react';
import CustomPortableText from '@/components/CustomPortableText';

export default function SectionIntro({ data }) {
	const { introHeading, introParagraph } = data || {};

	return (
		<section className="p-design__intro">
			{introHeading && (
				<h2 className="p-design__intro__title t-l-2">{introHeading}</h2>
			)}
			{introParagraph && <CustomPortableText blocks={introParagraph} />}
		</section>
	);
}
