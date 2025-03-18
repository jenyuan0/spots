'use client';

import React, { useEffect } from 'react';
import { hasArrayValue } from '@/lib/helpers';
import { format } from 'date-fns';
import PageModules from '@/components/PageModules';
import Img from '@/components/Image';
import GuideCard from '@/components/GuideCard';
import useAsideMap from '@/hooks/useAsideMap';
import CategoryPill from '@/components/CategoryPill';

// TODO:
// min to read in &__header__subtitle
// add author with portrait in &__header

export default function PageGuidesSingle({ data }) {
	const {
		title,
		thumb,
		publishDate,
		categories,
		subcategories,
		showContentTable,
		showMap,
		pageModules,
		related,
		defaultRelated,
	} = data || {};
	const setAsideMapActive = useAsideMap((state) => state.setAsideMapActive);
	const setAsideMapLocations = useAsideMap(
		(state) => state.setAsideMapLocations
	);

	useEffect(() => {
		const locations = pageModules
			?.filter((item) => item._type === 'locationList')
			.reduce((acc, curr) => [...acc, ...curr.locations], [])
			.filter(
				(location, index, self) =>
					self.findIndex(
						(l) => JSON.stringify(l) === JSON.stringify(location)
					) === index
			);

		setTimeout(() => {
			setAsideMapLocations(locations);
			setAsideMapActive(locations.length && showMap);
		}, 1);
	}, [pageModules]);

	return (
		<>
			<section className="p-guides-single__header">
				{thumb && (
					<div className="p-guides-single__image">
						<Img image={thumb} />
					</div>
				)}
				<div className="p-guides-single__heading">
					<div className="p-guides-single__categories t-b-1">
						{categories?.slice(0, 3).map((item) => (
							<CategoryPill className="pill" key={item.id} data={item} />
						))}
						{categories?.length < 3 &&
							subcategories
								?.slice(0, 3 - categories.length)
								.map((item) => (
									<CategoryPill className="pill" key={item.id} data={item} />
								))}
					</div>
					<h1 className="t-h-2">{title}</h1>
					<div className="p-guides-single__subtitle t-b-1">
						{format(publishDate, 'MMMM do')}
					</div>
				</div>
			</section>

			<section className="p-guides-single__body">
				{pageModules?.map((module, i) => (
					<div key={`page-module-${i}`} className="p-guides-single__module">
						<PageModules key={`page-module-${i}`} module={module} />
					</div>
				))}
			</section>

			{(hasArrayValue(related) || hasArrayValue(defaultRelated)) && (
				<section className="p-guides-related">
					<h2 className="p-guides-single-related__title">Related Guides</h2>
					<div className="p-guides-single-related__content">
						{[...Array(4)].map((_, index) => {
							const relatedItems = related || [];
							const defaultItems = defaultRelated || [];
							const allItems = [...relatedItems, ...defaultItems];
							const item = allItems[index];
							return (
								item && <GuideCard key={`${item._id}-${index}`} data={item} />
							);
						})}
					</div>
				</section>
			)}
		</>
	);
}
