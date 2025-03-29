import clsx from 'clsx';
import { hasArrayValue, formatTime } from '@/lib/helpers';
import Img from '@/components/Image';
import Button from '@/components/Button';
import Link from '@/components/CustomLink';
import CategoryPillList from '@/components/CategoryPillList';
import CustomPortableText from '@/components/CustomPortableText';
import useMagnify from '@/hooks/useMagnify';
import useLightbox from '@/hooks/useLightbox';
import useKey from '@/hooks/useKey';
import { IconMaximize } from '@/components/SvgIcons';

export default function LocationCard({
	data,
	layout = 'vertical',
	hasDirection = false,
}) {
	const {
		color,
		images,
		title,
		slug,
		categories,
		subcategories,
		address,
		res,
		content,
	} = data || {};
	const url = `/paris/locations/${slug}`;
	const addressString =
		address &&
		Object.values(address)
			.filter((value) => value)
			.join(', ');
	const resStart = res?.startTime && new Date(res?.startTime);
	const setMag = useMagnify((state) => state.setMag);
	const { setLightboxImages, setLightboxActive } = useLightbox();
	const { hasPressedKeys } = useKey();

	return (
		<div
			className={'c-card'}
			style={{ '--cr-primary': `var(--cr-${color}-d, var(--cr-brown))` }}
			data-layout={layout}
		>
			<div className="c-card__thumb">
				<div className="object-fit">{images && <Img image={images[0]} />}</div>
				{images && (
					<button
						className="c-card__lightbox trigger"
						onClick={() => {
							setLightboxImages(images);
							setLightboxActive(true);
						}}
					>
						<IconMaximize />
					</button>
				)}
			</div>
			<div className="c-card__info">
				{layout !== 'horizontal' &&
					(hasArrayValue(categories) || hasArrayValue(subcategories)) && (
						<div className="c-card__categories">
							<CategoryPillList
								categories={categories}
								subcategories={subcategories}
								limit={layout == 'vertical' ? 3 : 1}
							/>
						</div>
					)}
				<div className="c-card__header">
					<h3
						className={clsx(
							'c-card__title',
							layout == 'horizontal' ? 't-h-5' : 't-h-4'
						)}
					>
						{title}
					</h3>
				</div>
				{resStart && (
					<div className={'c-card__badge'}>
						Reservation: {formatTime(resStart)}
					</div>
				)}
				{layout == 'horizontal-full' && content && (
					<div className="c-card__content wysiwyg-b-2">
						<CustomPortableText blocks={content} />
					</div>
				)}
				<div className="c-card__actions">
					<Button
						className={clsx('btn-underline', color && `!cr-${color}-d`)}
						href={url}
						{...(!hasPressedKeys && {
							onClick: (e) => {
								e.preventDefault();
								setMag({
									slug: slug,
									type: 'location',
									color: color,
								});
							},
						})}
					>
						Details
					</Button>
					{hasDirection && (
						<Button
							className={clsx('btn-underline', color && `!cr-${color}-d`)}
							href={`https://www.google.com/maps/dir//${encodeURIComponent(addressString)}`}
							target="_blank"
						>
							Get Direction
						</Button>
					)}
				</div>
			</div>
			<Link href={url} ariaLabel={'Open location'} className="p-fill" />
		</div>
	);
}
