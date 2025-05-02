import React from 'react';
import CategoryPill from '@/components/CategoryPill';

export default function CategoryPillList({
	categories,
	subcategories,
	activeSlug,
	postType = 'locations',
	limit,
	children,
	isLink = false,
}) {
	const allCategories = [...(categories || []), ...(subcategories || [])];
	const finalCategories = limit ? allCategories.slice(0, limit) : allCategories;

	return (
		<ul className="c-category-pill-list">
			{children}
			{finalCategories?.map((item) => (
				<li key={`${item._id}`}>
					<CategoryPill
						isActive={item.slug === activeSlug}
						postType={postType}
						data={item}
						isLink={isLink}
					/>
				</li>
			))}
		</ul>
	);
}
