import React, { useState, useEffect } from 'react';
import { client } from '@/sanity/lib/client';
import { getCaseData } from '@/sanity/lib/queries';
import Img from '@/components/Image';
import CustomPortableText from '@/components/CustomPortableText';
import Button from '@/components/Button';
import LocationCard from '@/components/LocationCard';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import usePlanner from '@/hooks/usePlanner';
import { useCurrentLang } from '@/hooks/useCurrentLang';

export default function MagnifyCase({
	mParam,
	pageSlug,
	onColorChange,
	localization,
}) {
	const [caseContent, setCaseContent] = useState(null);
	const [color, setColor] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const { setPlannerActive, setPlannerContent } = usePlanner();
	const [currentLanguageCode] = useCurrentLang();

	useEffect(() => {
		const fetchData = async () => {
			if (!mParam) return;
			try {
				const dataSlug = mParam.split('/').pop();

				const [content] = await Promise.all([
					client.fetch(
						`coalesce(
			*[_type == "gCases" && language == "${currentLanguageCode}" && slug.current == "${dataSlug}"][0],
			*[_type == "gCases" && language == "en" && slug.current == "${dataSlug}"][0]
		){
			${getCaseData()}
		}`,
						{ language: currentLanguageCode } // Add this parameter
					),
				]);
				const contentColor = (content && content.color.title) || 'brown';
				setCaseContent(content);
				setColor(contentColor);
				if (onColorChange) onColorChange(contentColor);
			} catch (e) {
				console.error('Error fetching location content:', e);
			}
		};

		if (!isLoaded) {
			setIsLoaded(true);
			fetchData();
		}
	}, [mParam, pageSlug, onColorChange, isLoaded]);

	if (!isLoaded || !caseContent) {
		return null;
	}

	const data = { content: caseContent };

	const {
		title,
		subtitle,
		heroImage,
		highlights,
		offers,
		content,
		accomodations,
	} = data?.content || {};

	const {
		tripHighlights,
		ourRole,
		suggestedAccomodations,
		option: optionLabel,
		planYourTrip,
	} = localization || {};

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
					className={`btn cr-${color}-d js-gtm-design-popup`}
					onClick={() => {
						setPlannerActive(true);
						setPlannerContent({
							type: 'design',
						});
					}}
				>
					{planYourTrip || 'Plan Your Trip'}
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
							{accomodations.length} {optionLabel || 'Option'}
							{accomodations.length > 1 && currentLanguageCode === 'en' && 's'}
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
		</div>
	);
}
