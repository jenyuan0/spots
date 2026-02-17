'use client';

import React from 'react';
import { formatNumberWithCommas, getLocalizationPlural } from '@/lib/helpers';
import ImageHalftone from '@/components/ImageHalftone';
import CustomPortableText from '@/components/CustomPortableText';
import Button from '@/components/Button';
import LocationCard from '@/components/LocationCard';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import usePlanner from '@/hooks/usePlanner';
import { useCurrentLang } from '@/hooks/useCurrentLang';

export default function MagnifyCase({ data }) {
	const { setPlannerActive, setPlannerContent } = usePlanner();
	const [currentLanguageCode] = useCurrentLang();
	const {
		title,
		subtitle,
		heroImage,
		heroSubtitle,
		highlights,
		offers,
		inclusions,
		exclusions,
		content,
		accomodations,
		color,
		localizationGlobal,
		budget,
	} = data || {};
	const {
		tripHighlights,
		fees,
		feesNotes,
		ourRole,
		planYourTrip,
		suggestedAccomodations,
		option,
	} = localizationGlobal;

	return (
		<>
			<div className="g-magnify-cases__hero">
				{heroImage && (
					<span className="g-magnify-cases__hero__image object-fit">
						<ImageHalftone image={heroImage} />
					</span>
				)}

				<div className="g-magnify-cases__hero__text wysiwyg">
					{title && <h2 className="g-magnify-cases__heading t-h-1">{title}</h2>}
					{(heroSubtitle || subtitle) && (
						<h2 className="g-magnify-cases__subtitle t-h-4">
							{heroSubtitle || subtitle}
						</h2>
					)}
				</div>
			</div>
			<div className="g-magnify-cases__highlights">
				{highlights && (
					<div className="g-magnify-cases__summary">
						<h3 className="g-magnify-cases__summary-title t-l-1">
							{tripHighlights || 'Trip Highlights'}
						</h3>
						<div className="wysiwyg">
							<CustomPortableText blocks={highlights} />
						</div>
					</div>
				)}

				{budget.low && (
					<div className="g-magnify-cases__budget">
						<h3 className="g-magnify-cases__budget-title t-l-1">
							{fees || 'Fees'}
						</h3>
						<p className="t-h-4">
							USD ${formatNumberWithCommas(budget.low)}
							{budget.high && `—$${formatNumberWithCommas(budget.high)}`}
							{` per person`}
						</p>
						{feesNotes && <p className="t-b-2">{feesNotes}</p>}
					</div>
				)}
				<div className="g-magnify-cases__offers">
					<h3 className="g-magnify-cases__offers-title t-l-1">
						{ourRole || 'Our Role'}
					</h3>
					<ul className="t-b-1">
						{offers?.map((item, index) => (
							<li key={`offer-${index}`}>{item}</li>
						))}
					</ul>
					{exclusions && (
						<p>
							(<em>{exclusions}</em>)
						</p>
					)}
				</div>
				<Button
					className={`btn cr-${color.title || 'brown'}-d js-gtm-design-popup`}
					onClick={() => {
						setPlannerActive(true);
						setPlannerContent({
							type: 'design',
						});
					}}
				>
					{planYourTrip || 'Plan Your Trip with Spots'}
				</Button>
			</div>
			<div className="g-magnify-cases__content wysiwyg-page">
				<CustomPortableText blocks={content} />
			</div>
			{accomodations && (
				<div className="g-magnify-cases__accomodations">
					<h3 className="g-magnify-cases__title t-h-2">
						{suggestedAccomodations || 'Suggested Accomodations'}
						<span className="t-l-1">
							{getLocalizationPlural(
								currentLanguageCode,
								accomodations,
								option || 'Option'
							)}
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
		</>
	);
}
