import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { hasArrayValue, formatAddress } from '@/lib/helpers';
import Link from '@/components/CustomLink';
import Img from '@/components/Image';
import CustomPortableText from '@/components/CustomPortableText';
import Button from '@/components/Button';
import Carousel from '@/components/Carousel';
import CategoryPillList from '@/components/CategoryPillList';
import LocationHighlights from '@/components/LocationHighlights';

import LocationCard from '@/components/LocationCard';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import { client } from '@/sanity/lib/client';
import { getCaseData } from '@/sanity/lib/queries';
import usePlanner from '@/hooks/usePlanner';

export default function MagnifyCase({ mParam, pageSlug, onColorChange }) {
	const [caseContent, setCaseContent] = useState(null);
	const [color, setColor] = useState(null);
	const [isLoaded, setIsLoaded] = useState(false);
	const { setPlannerActive, setPlannerContent } = usePlanner();

	useEffect(() => {
		const fetchData = async () => {
			if (!mParam) return;
			try {
				const dataSlug = mParam.split('/').pop();
				const [content] = await Promise.all([
					client.fetch(
						`*[_type == "gCases" && slug.current == "${dataSlug}"][0]{
                ${getCaseData()}
              }`
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
	}, [mParam, pageSlug, onColorChange]);

	if (!isLoaded || !caseContent) {
		return null;
	}

	const data = { content: caseContent };

	const {
		title,
		subtitle,
		heroImage,
		introduction,
		offers,
		content,
		accomodations,
	} = data?.content || {};

	return (
		<div className="g-magnify-cases">
			{/* <div className="g-magnify-cases__header">
				<div className="t-h-4">Plan your trip right away</div>
				<Button
					className={`btn cr-${color}-d`}
					onClick={() => setPlannerActive(true)}
				>
					Plan Your Trip
				</Button>
			</div> */}

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
				{introduction && (
					<div className="g-magnify-cases__highlights__summary wysiwyg">
						<p className="t-h-4">{introduction}</p>
					</div>
				)}
				{offers && (
					<ul className="g-magnify-cases__highlights__offers t-b-1">
						{offers?.map((item, index) => (
							<li key={`offer-${index}`}>{item}</li>
						))}
					</ul>
				)}
				<Button
					className={`btn cr-${color}-d`}
					onClick={() => {
						setPlannerActive(true);
						setPlannerContent({
							type: 'design',
						});
					}}
				>
					Plan Your Own Trip
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
					<ResponsiveGrid className="g-magnify-cases__accomodations__grid">
						{accomodations.map((item, index) => (
							<LocationCard
								key={`item-${index}`}
								data={item}
								layout={'vertical-2'}
								hasDirection={true}
								isLinkout={true}
								hasDirection={false}
							/>
						))}
					</ResponsiveGrid>
				</div>
			)}
		</div>
	);
}
