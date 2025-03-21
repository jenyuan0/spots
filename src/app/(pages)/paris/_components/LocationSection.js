'use client';

import React from 'react';
import CategoryPill from '@/components/CategoryPill';
import LocationCard from '@/components/LocationCard';
import Button from '@/components/Button';

export default function LocationSection({ data }) {
	const { locationList, locationCategories } = data;

	if (!locationList) return false;

	return (
		<section className="p-paris__locations">
			<div className="p-paris__locations__grid">
				{locationList.map((item, index) => (
					<LocationCard key={`item-${index}`} data={item} layout="vertical" />
				))}
			</div>

			<div className="p-paris__locations__footer">
				<Button
					href={'/paris/locations'}
					className="p-paris__locations__cta btn-outline"
				>
					View All Locations
				</Button>
				<span className="t-l-1 cr-subtle-5">or browse by categories:</span>
				{locationCategories && (
					<ul className="p-paris__locations__footer-categories">
						{locationCategories.map((item) => (
							<li key={`category-${item._id}`}>
								<CategoryPill className="pill" data={item} isLink={true} />
							</li>
						))}
					</ul>
				)}
			</div>
		</section>
	);
}
