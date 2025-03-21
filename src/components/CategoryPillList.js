import React from 'react';
import CategoryPill from '@/components/CategoryPill';

export default function CategoryPillList({
	categories,
	subcategories,
	limit,
	isLink = false,
}) {
	const allCategories = [...(categories || []), ...(subcategories || [])];
	const finalCategories = limit ? allCategories.slice(0, limit) : allCategories;

	return (
		<div className="c-category-pill-list">
			{finalCategories.map((item) => (
				<CategoryPill
					className="pill"
					key={`${item._id}`}
					data={item}
					isLink={isLink}
				/>
			))}
		</div>
	);
}
