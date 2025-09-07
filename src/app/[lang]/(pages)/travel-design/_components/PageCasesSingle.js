'use client';

import React, { useState, useEffect } from 'react';
import Img from '@/components/Image';
import CustomPortableText from '@/components/CustomPortableText';
import Button from '@/components/Button';
import LocationCard from '@/components/LocationCard';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import usePlanner from '@/hooks/usePlanner';

export default function PageCasesSingle({ data }) {
	const { setPlannerActive, setPlannerContent } = usePlanner();
	const color = data.color.title;
	const {
		title,
		subtitle,
		heroImage,
		highlights,
		offers,
		content,
		accomodations,
	} = data || {};

	return (
		<div className="g-magnify-cases">
			<div className="g-magnify-cases__hero">
				{heroImage && (
					<span className="g-magnify-cases__hero__image object-fit">
						<Img image={heroImage} />
					</span>
				)}

				<div className="g-magnify-cases__hero__text wysiwyg">
					{title && <h2 className="g-magnify-cases__heading t-h-1">{title}</h2>}
					{subtitle && (
						<h2 className="g-magnify-cases__subtitle t-h-4">{subtitle}</h2>
					)}
				</div>
			</div>
			<div className="g-magnify-cases__highlights">
				<h3 className="g-magnify-cases__highlights__title t-l-1">
					Trip Highlights
				</h3>
				{highlights && (
					<div className="g-magnify-cases__highlights__summary wysiwyg">
						<CustomPortableText blocks={highlights} />
					</div>
				)}
				{offers && (
					<>
						<h3 className="g-magnify-cases__highlights__offers-title t-l-1">
							Our Role
						</h3>
						<ul className="g-magnify-cases__highlights__offers t-b-1">
							{offers?.map((item, index) => (
								<li key={`offer-${index}`}>{item}</li>
							))}
						</ul>
					</>
				)}
				<Button
					className={`btn cr-${color}-d js-gtm-design-popup`}
					onClick={() => {
						setPlannerActive(true);
						setPlannerContent({
							type: 'design',
						});
					}}
				>
					Plan Your Trip
				</Button>
			</div>
			<div className="g-magnify-cases__content wysiwyg-page">
				<CustomPortableText blocks={content} />
			</div>
			{accomodations && (
				<div className="g-magnify-cases__accomodations">
					<h3 className="g-magnify-cases__title t-h-2">
						Suggested Accomodations
						<span className="t-l-1">
							{accomodations.length} Option
							{accomodations.length > 1 && 's'}
						</span>
					</h3>
					<ResponsiveGrid
						className="g-magnify-cases__accomodations__grid"
						size={'sml'}
					>
						{accomodations.map((item, index) => (
							<LocationCard
								key={`item-${index}`}
								data={item}
								layout={'vertical-2'}
								hasDirection={false}
							/>
						))}
					</ResponsiveGrid>
				</div>
			)}
		</div>
	);
}
