'use client';

import React, { useId, useCallback, useMemo } from 'react';
import CustomPortableText from '@/components/CustomPortableText';
import GuideCard from '@/components/GuideCard';
import Carousel from '@/components/Carousel';
import LocationCard from '@/components/LocationCard';

export default function ContentList({ data }) {
	const { title, subtitle, excerpt, items } = data;
	const id = useId();

	const processCardsPreserveDirectOrder = useCallback(
		(itemArrays, maxItems = Infinity) => {
			if (itemArrays) return null;

			if (!Array.isArray(itemArrays)) {
				return [];
			}

			const directItems = [];
			let otherItems = [];

			// Process each item in the input array
			itemArrays.forEach((item) => {
				if (item?._id) {
					directItems.push(item);
				} else if (item.category?.items) {
					otherItems = [...otherItems, ...item.category.items];
				} else if (item.subcategory?.items) {
					otherItems = [...otherItems, ...item.subcategory.items];
				}
			});

			// Early return for max items
			if (directItems.length >= maxItems) {
				return directItems.slice(0, maxItems);
			}

			// Shuffle other items using Fisher-Yates
			const shuffledOtherItems = [...otherItems];
			for (let i = shuffledOtherItems.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[shuffledOtherItems[i], shuffledOtherItems[j]] = [
					shuffledOtherItems[j],
					shuffledOtherItems[i],
				];
			}

			// Filter duplicates efficiently
			const directItemIds = new Set(directItems.map((item) => item._id));
			const finalOtherItems = shuffledOtherItems.reduce((acc, item) => {
				if (
					item._id &&
					!directItemIds.has(item._id) &&
					directItems.length + acc.length < maxItems
				) {
					directItemIds.add(item._id);
					acc.push(item);
				}
				return acc;
			}, []);

			return [...directItems, ...finalOtherItems];
		},
		[]
	); // Empty dependency array since function doesn't depend on props/state

	const cards = useMemo(
		() => processCardsPreserveDirectOrder(items, 6),
		[items, processCardsPreserveDirectOrder]
	);

	const renderCard = useCallback(
		(el, index) => {
			const key = `${id}-${el._id || index}-${index}`;
			return el._type === 'gGuides' ? (
				<GuideCard
					key={key}
					layout="vertical"
					data={el}
					aria-label={`Guide card ${index + 1}`}
				/>
			) : (
				<LocationCard
					key={key}
					layout="vertical"
					data={el}
					aria-label={`Location card ${index + 1}`}
				/>
			);
		},
		[id]
	);

	if (!items) return null;

	return (
		<section
			className="p-paris__content-list"
			role="region"
			aria-label="Content list"
		>
			<div className="p-paris__content-list__header wysiwyg-b-2">
				{title && (
					<h2 className="p-paris__content-list__title t-l-1">{title}</h2>
				)}
				{subtitle && (
					<h3 className="p-paris__content-list__subtitle t-h-2">{subtitle}</h3>
				)}
				{excerpt && <CustomPortableText blocks={excerpt} />}
			</div>
			<div className="p-paris__content-list__items">
				<Carousel
					align="start"
					loop={false}
					isShowNav={true}
					gap="16px"
					aria-label="Content carousel"
				>
					{cards.map(renderCard)}
				</Carousel>
			</div>
		</section>
	);
}
