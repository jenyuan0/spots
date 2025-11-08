'use client';

import React from 'react';
import { getLocalizationPlural } from '@/lib/helpers';
import Img from '@/components/Image';
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
		highlights,
		offers,
		content,
		accomodations,
		color,
		localizationGlobal,
	} = data || {};
	const {
		tripHighlights,
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
					{tripHighlights || 'Trip Highlights'}
				</h3>
				{highlights && (
					<div className="g-magnify-cases__highlights__summary wysiwyg">
						<CustomPortableText blocks={highlights} />
					</div>
				)}
				{offers && (
					<>
						<h3 className="g-magnify-cases__highlights__offers-title t-l-1">
							{ourRole || 'Our Role'}
						</h3>
						<ul className="g-magnify-cases__highlights__offers t-b-1">
							{offers?.map((item, index) => (
								<li key={`offer-${index}`}>{item}</li>
							))}
						</ul>
					</>
				)}
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
								isLinkout={true}
							/>
						))}
					</ResponsiveGrid>
				</div>
			)}
		</>
	);
}
