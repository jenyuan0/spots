'use client';

import React, { useId } from 'react';
import CustomPortableText from '@/components/CustomPortableText';
import GuideCard from '@/components/GuideCard';
import Carousel from '@/components/Carousel';

export default function ContentList({ data }) {
	const { title, subtitle, content, items } = data;
	const id = useId();

	if (!items) return false;

	function processGuidesPreserveDirectOrder(guideArrays, maxGuides = Infinity) {
		// Input validation
		if (!Array.isArray(guideArrays)) {
			return [];
		}

		let directGuides = [];
		let otherGuides = [];

		// Process each item in the input array
		for (const item of guideArrays) {
			if (item?._id) {
				directGuides.push(item);
			} else if (item.category?.guides) {
				otherGuides = otherGuides.concat(item.category.guides);
			} else if (item.subcategory?.guides) {
				otherGuides = otherGuides.concat(item.subcategory.guides);
			}
		}

		// If direct guides already exceed the max, just take the first maxGuides
		if (directGuides.length >= maxGuides) {
			return directGuides.slice(0, maxGuides);
		}

		// Randomize only the other guides (Fisher-Yates shuffle)
		for (let i = otherGuides.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[otherGuides[i], otherGuides[j]] = [otherGuides[j], otherGuides[i]];
		}

		// Create a set of IDs from direct guides for faster lookup
		const directGuideIds = new Set(directGuides.map((guide) => guide._id));

		// Filter out duplicates from other guides (those already in direct guides)
		const uniqueOtherGuides = otherGuides.filter(
			(guide) => guide._id && !directGuideIds.has(guide._id)
		);
		const allIds = new Set(directGuideIds);
		const finalOtherGuides = [];
		for (const guide of uniqueOtherGuides) {
			if (!allIds.has(guide._id)) {
				allIds.add(guide._id);
				finalOtherGuides.push(guide);

				// Stop adding guides if we've reached the maximum
				if (directGuides.length + finalOtherGuides.length >= maxGuides) {
					break;
				}
			}
		}

		return [...directGuides, ...finalOtherGuides].slice(0, maxGuides);
	}

	const guides = processGuidesPreserveDirectOrder(items, 6);

	return (
		<section className="p-paris__content-list">
			<div className="p-paris__content-list__header wysiwyg-b-2">
				<h2 className="p-paris__content-list__title t-l-1">{title}</h2>
				<h3 className="p-paris__content-list__subtitle t-h-2">{subtitle}</h3>
				<CustomPortableText blocks={content} />
			</div>
			<div className="p-paris__content-list__items">
				<Carousel align={'start'} loop={false} isShowNav={true} gap="10px">
					{guides.map((el, i) => {
						return (
							<GuideCard layout={'vertical'} key={`${id}-${i}`} data={el} />
						);
					})}
				</Carousel>
			</div>
		</section>
	);
}
