import clsx from 'clsx';
import React, { useState, useEffect } from 'react';
import { hasArrayValue, formatTime } from '@/lib/helpers';
import Img from '@/components/Image';
import Link from '@/components/CustomLink';
import Button from '@/components/Button';
import CategoryPillList from '@/components/CategoryPillList';
import CustomPortableText from '@/components/CustomPortableText';
import LocationHighlights from '@/components/LocationHighlights';
import useMagnify from '@/hooks/useMagnify';
import useLightbox from '@/hooks/useLightbox';
import useKey from '@/hooks/useKey';
import { IconMaximize } from '@/components/SvgIcons';

// Extract ImageGallery into separate component
const ImageGallery = ({ images, layout, onLightbox }) => {
	if (layout === 'embed') {
		if (!images) return null;

		return (
			<div className="c-card__gallery">
				{images[0] && (
					<Img image={images[0]} loading="lazy" alt={images[0]?.alt || ''} />
				)}
				{images[0]?.aspectRatio < 1.2 && images[1] && (
					<Img image={images[1]} loading="lazy" alt={images[1]?.alt || ''} />
				)}
			</div>
		);
	}

	return (
		<div className="c-card__thumb">
			<div className="object-fit">
				{images && (
					<Img image={images[0]} loading="lazy" alt={images[0]?.alt || ''} />
				)}
			</div>
			{images && (
				<button
					className="c-card__lightbox trigger"
					onClick={onLightbox}
					aria-label="View full size images"
				>
					<IconMaximize />
				</button>
			)}
		</div>
	);
};

// TODO
// Include pricing, address, and book CTA in embed view

// Main LocationCard component
export default function LocationCard({
	data,
	layout = 'vertical-1',
	hasDirection = false,
	contentReplace,
	isLinkout,
}) {
	const {
		images,
		title,
		slug,
		categories,
		subcategories,
		highlights,
		address,
		res,
		content,
	} = data;

	const url = `/locations/${slug}`;
	const addressString =
		address && Object.values(address).filter(Boolean).join(', ');
	const resStart = res?.startTime && new Date(res?.startTime);
	const [isShowContent, setIsShowContent] = useState(false);
	const [categoryPillLimit, setCategoryPillLimit] = useState(1);

	// Hooks
	const setMag = useMagnify((state) => state.setMag);
	const { setLightboxImages, setLightboxActive } = useLightbox();
	const { hasPressedKeys } = useKey();

	// Event handlers
	const handleLightbox = () => {
		setLightboxImages(images);
		setLightboxActive(true);
	};

	const handleDetailsClick = (e) => {
		if (!hasPressedKeys && !isLinkout) {
			e.preventDefault();
			setMag({
				slug,
				type: 'location',
			});
		}
	};

	useEffect(() => {
		setIsShowContent(
			['horizontal-2', 'embed'].includes(layout) && (content || contentReplace)
		);
		setCategoryPillLimit(
			['horizontal-1', 'horizontal-2'].includes(layout) ? 1 : 2
		);
	}, [layout, content, contentReplace]);

	return (
		<div className={'c-card'} data-layout={layout} role="article">
			<ImageGallery
				images={images}
				layout={layout}
				onLightbox={handleLightbox}
			/>
			<div className="c-card__info">
				{layout !== 'embed' &&
					(hasArrayValue(categories) || hasArrayValue(subcategories)) && (
						<div className="c-card__categories">
							<CategoryPillList
								categories={categories}
								subcategories={subcategories}
								limit={categoryPillLimit}
							/>
						</div>
					)}
				<div className="c-card__header">
					{highlights && layout == 'vertical-2' && (
						<div className="c-card__highlights t-l-2">
							<LocationHighlights highlights={highlights} />
						</div>
					)}
					<h3
						className={clsx('c-card__title', {
							't-h-3': layout === 'embed',
							't-h-4': layout === 'vertical',
							't-h-3': layout === 'vertical-2',
							't-h-5': layout === 'horizontal-1',
							't-h-4': layout === 'horizontal-2',
						})}
					>
						{title}
					</h3>
				</div>
				{resStart && (
					<div className="c-card__badge" role="status">
						Reservation: {formatTime(resStart)}
					</div>
				)}
				{isShowContent && (
					<div
						className={clsx('c-card__content', {
							'wysiwyg-b-1': layout === 'embed',
							'wysiwyg-b-2': layout === 'horizontal-2',
						})}
					>
						<CustomPortableText blocks={contentReplace || content} />
					</div>
				)}
				<div className="c-card__actions">
					<Button
						className={clsx('btn-underline', {
							'cr-cream': layout === 'vertical-2',
						})}
						href={url}
						isNewTab={true}
						onClick={handleDetailsClick}
					>
						{isShowContent && layout !== 'embed' ? 'Read More' : 'Details'}
					</Button>
					{hasDirection && addressString && (
						<Button
							className={clsx('btn-underline', {
								'cr-cream': layout === 'vertical-2',
							})}
							href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title)}+${encodeURIComponent(addressString)}`}
							isNewTab={true}
							rel="noopener noreferrer"
						>
							Get Direction
						</Button>
					)}
				</div>
			</div>
			<Link
				className={`c-card__url p-fill`}
				href={url}
				onClick={handleDetailsClick}
				title={`View ${title}`}
				isNewTab={true}
				aria-label="Read more"
				tabIndex="-1"
			/>
		</div>
	);
}
