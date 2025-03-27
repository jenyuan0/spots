'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from '@/components/CustomLink';
import { colorArray } from '@/lib/helpers';

const SeasonalClock = ({ seasons }) => {
	const [rotatingText, setRotatingText] = useState('');
	const [rotation, setRotation] = useState(0);
	const [color, setColor] = useState(null);
	const [textIndex, setTextIndex] = useState(0);

	useEffect(() => {
		const interval = setInterval(() => {
			const date = new Date();
			const month = date.getMonth();
			let currentSeason;
			if (month >= 2 && month <= 4) currentSeason = 'Spring';
			else if (month >= 5 && month <= 7) currentSeason = 'Summer';
			else if (month >= 8 && month <= 10) currentSeason = 'Autumn';
			else currentSeason = 'Winter';

			const seasonData = seasons.find((s) => s.name === currentSeason);
			const texts = seasonData?.activities || [];
			setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
			setRotatingText(texts[textIndex]);
			setRotation((prev) => (prev + 15) % 360);
			setColor(
				colorArray()[
					Math.floor(Math.random() * colorArray.length)
				].toLowerCase()
			);
		}, 600);

		return () => {
			clearInterval(interval);
		};
	}, [textIndex, seasons]);

	return (
		<div
			className="p-paris__season__clock"
			style={{
				'--cr-primary': `var(--cr-${color}-d)`,
			}}
		>
			<div
				className="p-paris__season__clock__center"
				style={{
					transform: `rotate(${rotation}deg)`,
				}}
			>
				<div className="p-paris__season__clock__label">{rotatingText}</div>
			</div>
		</div>
	);
};

export default function SeasonSection({ data }) {
	const { seasonsTitle, seasons } = data;

	return (
		<section className="p-paris__season">
			{/* <SeasonalClock seasons={seasons} /> */}
			<div className="p-paris__season__table">
				<h2 className="p-paris__season__heading t-h-2">{seasonsTitle}</h2>

				{seasons.map((season, index) => {
					const { name, description, months, guide } = season;
					const headerContent = (
						<>
							{name && (
								<h3 className="t-h-5">
									{name} <span className="icon-caret-right" />
								</h3>
							)}
							{description && <p className="t-b-2">{description}</p>}
						</>
					);

					return (
						<div
							key={`${name}-${index}`}
							className="p-paris__season__table__section"
						>
							{guide ? (
								<Link
									href={`/paris/guides/${guide.slug}`}
									className="p-paris__season__table__header"
								>
									{headerContent}
								</Link>
							) : (
								<div className="p-paris__season__table__header">
									{headerContent}
								</div>
							)}
							<ul className="p-paris__season__table__body">
								{months?.map((month) => (
									<li key={month.name}>
										{month.guide ? (
											<h4 className="t-h-4">
												<Link href={`/paris/guides/${month.guide.slug}`}>
													{month.name}
												</Link>
											</h4>
										) : (
											<>
												<h4 className="t-h-4">{month.name}</h4>
												<div className="pill">Guide Coming Soon</div>
											</>
										)}
									</li>
								))}
							</ul>
						</div>
					);
				})}
			</div>
		</section>
	);
}
