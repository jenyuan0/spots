'use client';

import React, { useId } from 'react';
import LocationsPagination from '../locations/_components/LocationsPagination';
import LocationsInfiniteScroll from '../locations/_components/LocationsInfiniteScroll';
import { Suspense } from 'react';
import Link from '@/components/CustomLink';
import CustomPortableText from '@/components/CustomPortableText';
import GuideCard from '@/components/GuideCard';
import { IconDemo1, IconDemo2, IconDemo3 } from '@/components/SvgIcons';
import Carousel from '@/components/Carousel';

function GuideList({ data }) {
	const { title, content, color, items } = data;
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
		<section
			className="p-locations__guides"
			style={{
				'--cr-primary': `var(--cr-${color || 'green'}-d)`,
				'--cr-secondary': `var(--cr-${color || 'green'}-l)`,
			}}
		>
			<div className="p-locations__guides__header wysiwyg">
				<div className="p-locations__guides__title t-h-2">{title}</div>
				<div className="p-locations__guides__subtitle">
					<CustomPortableText blocks={content} />
				</div>
			</div>

			<div className="p-locations__guides__list">
				<Carousel loop={false} isShowNav={true} itemWidth="300px" gap="10px">
					{guides.map((el, i) => {
						return (
							<GuideCard
								layout={'horizontal'}
								key={`${id}-${i}`}
								data={el}
								color={color}
							/>
						);
					})}
				</Carousel>
			</div>
		</section>
	);
}

export default function PageParis({ data }) {
	const { heading, paginationMethod, guideList } = data || {};

	return (
		<>
			<section className="p-locations__heading">
				{heading && (
					<h1 className="t-h-1">
						<CustomPortableText blocks={heading} hasPTag={false} />
					</h1>
				)}
			</section>
			<section className="p-locations__filters">
				<Link className="p-locations__filters__link" href="/">
					<IconDemo1 />
					<div className="p-locations__filters__label t-l-1">
						All <br /> Spots
					</div>
				</Link>
				<Link className="p-locations__filters__link" href="/">
					<IconDemo1 />
					<div className="p-locations__filters__label t-l-1">
						Food <br />& Drinks
					</div>
				</Link>
				<Link className="p-locations__filters__link" href="/">
					<IconDemo1 />
					<div className="p-locations__filters__label t-l-1">
						Sights & Attractions
					</div>
				</Link>
				<Link className="p-locations__filters__link" href="/">
					<IconDemo1 />
					<div className="p-locations__filters__label t-l-1">
						Gifts & Shopping
					</div>
				</Link>
				<Link className="p-locations__filters__link" href="/">
					<IconDemo1 />
					<div className="p-locations__filters__label t-l-1">
						Gifts & Shopping
					</div>
				</Link>
				<Link className="p-locations__filters__link" href="/">
					<IconDemo1 />
					<div className="p-locations__filters__label t-l-1">
						Gifts & Shopping
					</div>
				</Link>
			</section>
			{paginationMethod === 'page-numbers' || !paginationMethod ? (
				<Suspense>
					<LocationsPagination data={data} />
				</Suspense>
			) : (
				<LocationsInfiniteScroll data={data} />
			)}

			{guideList?.map((el, index) => (
				<GuideList key={`guide-row-${index}`} data={el} />
			))}
		</>
	);
}
