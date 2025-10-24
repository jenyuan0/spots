'use client';

import React from 'react';
import clsx from 'clsx';
import { hasArrayValue, formatAddress } from '@/lib/helpers';
import CustomPortableText from '@/components/CustomPortableText';
import Img from '@/components/Image';
import Link from '@/components/CustomLink';
import Breadcrumb from '@/components/Breadcrumb';
import CategoryPillList from '@/components/CategoryPillList';
import ResponsiveGrid from '@/components/ResponsiveGrid';
import LocationCard from '@/components/LocationCard';
import GuideCard from '@/components/GuideCard';
import useLightbox from '@/hooks/useLightbox';
import Carousel from '@/components/Carousel';
import { useCurrentLang } from '@/hooks/useCurrentLang';

export default function PageLocationsSingle({ data, siteData }) {
	const [currentLanguageCode] = useCurrentLang();
	const { localization: siteLocalization } = siteData || {};
	const { addressLabel, websiteLabel } = siteLocalization || {};
	const {
		color,
		title,
		geo,
		address,
		price,
		categories,
		subcategories,
		images,
		content,
		urls,
		fees,
		relatedLocations,
		relatedGuides,
		defaultRelatedLocations,
		defaultRelatedGuides,
		localization,
	} = data || {};

	const { moreSpotsToDiscover, locationsLabel } = localization || {};
	const breadcrumbTitle = locationsLabel ? locationsLabel : 'Locations';
	const addressString =
		address &&
		Object.values(address)
			.filter((value) => value)
			.join(', ');
	const { setLightboxImages, setLightboxActive } = useLightbox();

	const breadcrumb = [
		{
			title: breadcrumbTitle,
			url: `/${currentLanguageCode}/locations`,
		},
		{
			title: categories[0].title,
			url: `/${currentLanguageCode}/locations/category/${categories[0].slug}`,
		},
	];

	// TODO
	// Share
	// Why we like it? section
	// and add price info

	return (
		<>
			{images && (
				<Carousel
					className="p-locations-single__images"
					isShowDots={true}
					gap={'5px'}
				>
					{images.map((image, i) => (
						<button
							key={`image-${i}`}
							onClick={() => {
								setLightboxImages(images, i);
								setLightboxActive(true);
							}}
						>
							<Img key={`image-${i}`} image={image} />
						</button>
					))}
				</Carousel>
			)}
			<section className="p-locations-single__text">
				{breadcrumb && <Breadcrumb data={breadcrumb} />}
				<h1 className="p-locations-single__heading t-h-1">{title}</h1>
				{address && (
					<div className="p-locations-single__address wysiwyg-b-1">
						<h3 className="t-l-1">{addressLabel || 'Address'}</h3>
						<p>
							<Link
								href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title)}+${encodeURIComponent(addressString)}`}
								isNewTab={true}
							>
								{formatAddress(address)}
							</Link>
						</p>
					</div>
				)}
				{hasArrayValue(urls) && (
					<div className="p-locations-single__urls wysiwyg-b-1">
						<h3 className="t-l-1">{websiteLabel || 'Website'}</h3>
						<ul>
							{urls.map((url, i) => (
								<li key={`url-${i}`}>
									<Link href={url} isNewTab={true}>
										{url
											.replace(/^(https?:\/\/)?(www\.)?/, '')
											.replace(/\/$/, '')}
									</Link>
								</li>
							))}
						</ul>
					</div>
				)}
				{content && (
					<div className="p-locations-single__content wysiwyg-page">
						<CustomPortableText blocks={content} />
					</div>
				)}
				{hasArrayValue(fees) && (
					<div className="p-locations-single__fees wysiwyg-b-1">
						<h3 className="t-l-1">Fees</h3>
						<p>{fees.map((fee) => fee).join(' • ')}</p>
					</div>
				)}
				{(hasArrayValue(categories) || hasArrayValue(subcategories)) && (
					<div className="p-locations-single__categories">
						<CategoryPillList
							categories={categories}
							subcategories={subcategories}
							isLink={true}
						/>
					</div>
				)}
			</section>

			{(hasArrayValue(relatedLocations) ||
				hasArrayValue(defaultRelatedLocations)) && (
				<section className="p-locations-single__related">
					<h2 className="p-locations-single__related__title t-h-2">
						{moreSpotsToDiscover || 'More Spots to Discover'}
					</h2>
					{/* TODO
					// prioritize subcategories and other attributes such as editors pick, trending, etc.
					 */}
					<ResponsiveGrid
						className="p-locations-single__related__list"
						size={'sml'}
					>
						{[...Array(12)].map((_, index) => {
							const relatedItems = relatedLocations || [];
							const defaultItems = defaultRelatedLocations || [];
							const allItems = [...relatedItems, ...defaultItems];
							const item = allItems[index];
							return (
								item && (
									<LocationCard
										key={`${item._id}-${index}`}
										data={item}
										layout="vertical-2"
										isLinkout={true}
									/>
								)
							);
						})}
					</ResponsiveGrid>
				</section>
			)}
			{/* {(hasArrayValue(relatedGuides) ||
				hasArrayValue(defaultRelatedGuides)) && (
				<section className="p-locations-single__related">
					<h2 className="p-locations-single__related__title t-h-2">
						From our Guides
					</h2>
					<div className="p-locations-single__related__list">
						<ResponsiveGrid>
							{[...Array(12)].map((_, index) => {
								const relatedItems = relatedGuides || [];
								const defaultItems = defaultRelatedGuides || [];
								const allItems = [...relatedItems, ...defaultItems];
								const item = allItems[index];
								return (
									item && <GuideCard key={`${item._id}-${index}`} data={item} />
								);
							})}
						</ResponsiveGrid>
					</div>
				</section>
			)} */}
		</>
	);
}
