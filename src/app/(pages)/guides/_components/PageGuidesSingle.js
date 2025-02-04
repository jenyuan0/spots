'use client';

import React from 'react';
import CustomPortableText from '@/components/CustomPortableText';
import { hasArrayValue } from '@/lib/helpers';
import GuideCard from '@/components/GuideCard';

export default function PageGuidesSingle({ data }) {
	const { title, content, defaultRelated } = data || {};

	return (
		<>
			<section className="p-guides-single">
				<h1 className="p-guides-single__title">{title}</h1>
				<div className="p-guides-single__content wysiwyg-page">
					<CustomPortableText blocks={content} />
				</div>
			</section>

			{hasArrayValue(defaultRelated) && (
				<section className="p-guides-related">
					<h2 className="p-guides-related__title">Related Articles</h2>
					<div className="p-guides-related__content">
						{defaultRelated.map((item) => (
							<GuideCard key={item._id} data={item} />
						))}
					</div>
				</section>
			)}
		</>
	);
}
