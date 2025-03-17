'use client';

import React, { useEffect } from 'react';
import { hasArrayValue } from '@/lib/helpers';
import PageModules from '@/components/PageModules';
import Img from '@/components/Image';
import GuideCard from '@/components/GuideCard';
import useAsideMap from '@/hooks/useAsideMap';

export default function PageGuidesSingle({ data }) {
	const {
		title,
		thumb,
		publishDate,
		categories,
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
			.filter((item) => item._type === 'locationList')
			.reduce((acc, curr) => [...acc, ...curr.locations], [])
			.filter(
				(location, index, self) =>
					self.findIndex(
						(l) => JSON.stringify(l) === JSON.stringify(location)
					) === index
			);

		setTimeout(() => {
			setAsideMapLocations(locations);
			setAsideMapActive(true);
		}, 1);
	}, [pageModules]);

	return (
		<>
			<section className="p-guides-single data-container">
				<h1 className="p-guides-single__title">{title}</h1>
				<div className="data-container-small">
					{thumb && <Img image={thumb} />}
				</div>

				<div className="p-guides-single__content data-block">
					Publish Date: {publishDate}
					<br />
					Categories: {categories?.map((cat) => cat.title).join(' • ')}
					<br />
					Show Content Table: {showContentTable?.toString() || 'FALSE'}
					<br />
					Show Map: {showMap?.toString() || 'FALSE'}
					<br />
					<br />
					{pageModules?.map((module, i) => (
						<div key={`page-module-${i}`} className="data-block">
							<h3>Module type: {module._type}</h3>
							<PageModules key={`page-module-${i}`} module={module} />
						</div>
					))}
				</div>

				<div className="data-block">
					{(hasArrayValue(related) || hasArrayValue(defaultRelated)) && (
						<section className="p-guides-related">
							<h2 className="p-guides-related__title">Related Guides</h2>
							<div className="p-guides-related__content">
								{[...Array(4)].map((_, index) => {
									const relatedItems = related || [];
									const defaultItems = defaultRelated || [];
									const allItems = [...relatedItems, ...defaultItems];
									const item = allItems[index];
									return (
										item && (
											<GuideCard key={`${item._id}-${index}`} data={item} />
										)
									);
								})}
							</div>
						</section>
					)}
				</div>
			</section>
		</>
	);
}
