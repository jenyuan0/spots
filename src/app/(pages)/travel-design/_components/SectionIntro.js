'use client';

import React from 'react';
import CustomPortableText from '@/components/CustomPortableText';

export default function SectionIntro({ data }) {
	const { introTitle, introHeading } = data || {};

	return (
		<section
			className="p-design__intro wysiwyg"
			style={{ '--cr-primary': `var(--cr-red-d)` }}
		>
			{introTitle && (
				<h2 className="p-design__intro__title t-l-1">{introTitle}</h2>
			)}
			{introHeading && (
				<p className="t-h-2">
					<CustomPortableText blocks={introHeading} hasPTag={false} />
				</p>
			)}
		</section>
	);
}
