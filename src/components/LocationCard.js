import clsx from 'clsx';
import { hasArrayValue, formatTime, formatAddress } from '@/lib/helpers';
import Img from '@/components/Image';
import Button from '@/components/Button';
import Link from '@/components/CustomLink';
import CategoryPillList from '@/components/CategoryPillList';
import CustomPortableText from '@/components/CustomPortableText';
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
				{images && images[0] && (
					<Img image={images[0]} loading="lazy" alt={images[0]?.alt || ''} />
				)}
				{images && images[1] && (
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
	color,
	hasDirection = false,
	contentReplace,
}) {
	const {
		images,
		title,
		slug,
		categories,
		subcategories,
		address,
		res,
		content,
	} = data;

	const url = `/paris/locations/${slug}`;
	const addressString =
		address && Object.values(address).filter(Boolean).join(', ');
	const resStart = res?.startTime && new Date(res?.startTime);

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
		if (!hasPressedKeys) {
			e.preventDefault();
			setMag({
				slug,
				type: 'location',
				color: data.color,
			});
		}
	};

	return (
		<div
			className={'c-card'}
			data-layout={layout}
			role="article"
			style={
				color && {
					'--cr-primary': `var(--cr-${color}-d)`,
					'--cr-secondary': `var(--cr-${color}-l)`,
				}
			}
		>
			<ImageGallery
				images={images}
				layout={layout}
				onLightbox={handleLightbox}
			/>
			<div className="c-card__info">
				{!['horizontal-2', 'embed'].includes(layout) &&
					(hasArrayValue(categories) || hasArrayValue(subcategories)) && (
						<div className="c-card__categories">
							<CategoryPillList
								categories={categories}
								subcategories={subcategories}
								limit={layout == 'horizontal-1' ? 1 : 3}
							/>
						</div>
					)}
				<div className="c-card__header">
					<h3
						className={clsx('c-card__title', {
							't-h-3': layout === 'embed',
							't-h-4': layout === 'vertical',
							't-h-3': layout === 'vertical-2',
							't-h-5': layout === 'horizontal-1',
							't-h-2': layout === 'horizontal-2',
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
				{layout == 'embed' && (content || contentReplace) && (
					<div className={`c-card__content wysiwyg-b-1`}>
						<CustomPortableText blocks={contentReplace || content} />
					</div>
				)}
				<div className="c-card__actions">
					<Button
						className={clsx('btn-underline', {
							'cr-cream': layout === 'vertical-2',
						})}
						href={url}
						onClick={handleDetailsClick}
						aria-label={`View more details for ${title}`}
					>
						Details
					</Button>
					{hasDirection && addressString && (
						<Button
							className={clsx('btn-underline', {
								'cr-cream': layout === 'vertical-2',
							})}
							href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title)}+${encodeURIComponent(addressString)}`}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`Get directions to ${title}`}
						>
							Get Direction
						</Button>
					)}
				</div>
			</div>
			<Button
				className={`c-card__url p-fill`}
				href={url}
				onClick={handleDetailsClick}
				aria-label={`View more details for ${title}`}
			/>
		</div>
	);
}
