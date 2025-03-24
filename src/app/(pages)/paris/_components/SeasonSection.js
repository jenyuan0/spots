'use client';

import React, { useEffect, useState, useRef } from 'react';
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

const SeasonalClock = () => {
	const [rotatingText, setRotatingText] = useState('');
	const [rotation, setRotation] = useState(0);
	const [textIndex, setTextIndex] = useState(0);

	const seasonalText = {
		spring: [
			'Early blooms in Luxembourg Gardens',
			'Picnics along Canal Saint-Martin',
			'Gallery openings in Le Marais',
			'Cherry blossoms at Notre-Dame',
			'Outdoor café terraces buzzing',
			'Market streets come alive',
			'Seine River cruises begin',
			'Art fairs in full swing',
			'Garden tours at Versailles',
			'Food festivals emerge',
			'Photography walks bloom',
			'Rooftop bars reopen',
		],
		summer: [
			'Jazz concerts in parks',
			'Seine-side sunbathing',
			'Bastille Day fireworks',
			'Open-air cinema nights',
			'Street music festivals',
			'Paris Plages beach life',
			'Garden parties at dusk',
			'Outdoor food markets peak',
			'Evening boat parties',
			'Courtyard concerts play',
			'Park picnics flourish',
			'Night markets sparkle',
		],
		autumn: [
			'Fashion Week dazzles',
			'Wine harvests celebrate',
			'Art galleries premiere',
			'Autumn leaves in parks',
			'Food festivals abound',
			'Cultural nights begin',
			'Jazz clubs heat up',
			'Museum nights return',
			'Chocolate fairs delight',
			'Theater season opens',
			'Literary events gather',
			'Café culture thrives',
		],
		winter: [
			'Christmas lights twinkle',
			'Ice skating begins',
			'Holiday markets charm',
			'Winter sales excite',
			'Cozy bistros welcome',
			'Hot chocolate season',
			'Gallery nights warm up',
			"Valentine's romance blooms",
			'Concert halls resound',
			'Cabaret shows dazzle',
			'Classical music soars',
			'Candlelit dinners glow',
		],
	};

	useEffect(() => {
		const interval = setInterval(() => {
			const date = new Date();
			const month = date.getMonth();
			let season;
			if (month >= 2 && month <= 4) season = 'spring';
			else if (month >= 5 && month <= 7) season = 'summer';
			else if (month >= 8 && month <= 10) season = 'autumn';
			else season = 'winter';

			const texts = seasonalText[season];
			setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
			setRotatingText(texts[textIndex]);

			// Update rotation with the same interval
			setRotation((prev) => (prev + 15) % 360);
		}, 400);

		return () => {
			clearInterval(interval);
		};
	}, [textIndex]);

	return (
		<div
			className="p-paris__season__header__hand"
			style={{
				transform: `rotate(${rotation}deg)`,
			}}
		>
			<div className="p-paris__season__header__label">{rotatingText}</div>
		</div>
	);
};

export default function SeasonSection() {
	return (
		<section className="p-paris__season">
			<div className="p-paris__season__header">
				<h2 className="p-paris__season__header__heading t-h-1">
					The Best Time <span>to Visit Paris</span>
				</h2>
				<SeasonalClock />
			</div>
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
