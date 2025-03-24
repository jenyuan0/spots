'use client';

import React from 'react';
import Link from '@/components/CustomLink';

const seasonData = [
	{
		season: 'Spring',
		description: 'Experience Paris blooming with fewer tourist crowds',
		months: [
			{ name: 'March', details: 'Early spring blooms with smaller crowds' },
			{ name: 'April', details: 'Peak bloom season with mild temperatures' },
			{ name: 'May', details: 'Perfect weather for exploring the city' },
		],
	},
	{
		season: 'Summer',
		description: 'Long sunlit evenings perfect for outdoor dining adventures',
		months: [
			{
				name: 'June',
				details: 'Extended daylight hours for evening dining',
			},
			{ name: 'July', details: 'Prime time for outdoor cafes and restaurants' },
			{
				name: 'August',
				details: 'Warm evenings ideal for alfresco experiences',
			},
		],
	},
	{
		season: 'Fall',
		description: 'Budget-friendly exploration with stunning autumn colors',
		months: [
			{ name: 'September', details: 'Beginning of better travel deals' },
			{ name: 'October', details: 'Beautiful fall foliage in Paris parks' },
			{ name: 'November', details: 'Lower prices and fewer tourists' },
		],
	},
	{
		season: 'Winter',
		description: 'Magical Christmas markets and incredible shopping deals',
		months: [
			{ name: 'December', details: 'Festive Christmas markets and shopping' },
			{ name: 'January', details: 'Winter sales and shopping opportunities' },
			{
				name: 'February',
				details: 'End of winter season with remaining deals',
			},
		],
	},
];

export default function SeasonSection() {
	return (
		<section className="p-paris__season">
			<h2 className="p-paris__season__header t-h-2">
				Find Your Best Time to Visit Paris
			</h2>
			<div className="p-paris__season__clock" />
			<div className="p-paris__season__table">
				{seasonData.map(({ season, description, months }) => (
					<React.Fragment key={season}>
						<Link href={'/'} className="p-paris__season__table__header wysiwyg">
							<h3 className="t-h-5">{season}</h3>
							<p className="t-h-5">{description}</p>
						</Link>
						<ul className="p-paris__season__table__body">
							{months.map(({ name, details }) => (
								<li key={name}>
									<Link href={'/'} className={'wysiwyg'}>
										<h4 className="t-h-3">{name}</h4>
										<p className="t-h-5">{details}</p>
									</Link>
								</li>
							))}
						</ul>
					</React.Fragment>
				))}
			</div>
		</section>
	);
}
