import clsx from 'clsx';
import { hasArrayValue, formatTime } from '@/lib/helpers';
import Img from '@/components/Image';
import Button from '@/components/Button';
import CategoryPill from '@/components/CategoryPill';
import CustomPortableText from '@/components/CustomPortableText';
import useMagnify from '@/hooks/useMagnify';
import useKey from '@/hooks/useKey';

// TODO:
// Ability to expand image gallery on click

export default function LocationCard({ data, layout = 'vertical', color }) {
	const {
		thumb,
		title,
		slug,
		categories,
		subcategories,
		geo,
		address,
		res,
		content,
	} = data || {};
	const cardColor = color || data.color;
	const url = `/locations/${slug}`;
	const addressString =
		address &&
		Object.values(address)
			.filter((value) => value)
			.join(', ');
	const resStart = res?.startTime && new Date(res?.startTime);
	const setMag = useMagnify((state) => state.setMag);
	const { hasPressedKeys } = useKey();

	return (
		<div
			className={'c-card'}
			style={{ color: `var(--cr-${cardColor}-d, var(--cr-brown))` }}
			data-layout={layout}
		>
			<div className="c-card__thumb">
				<span className="object-fit">{thumb && <Img image={thumb} />}</span>
			</div>
			<div className="c-card__info">
				{layout !== 'horizontal' &&
					(hasArrayValue(categories) || hasArrayValue(subcategories)) && (
						<div className="c-card__categories">
							{categories?.slice(0, 3).map((item) => (
								<CategoryPill className="pill" key={item.id} data={item} />
							))}
							{categories?.length < 3 &&
								subcategories
									?.slice(0, 3 - categories.length)
									.map((item) => (
										<CategoryPill className="pill" key={item.id} data={item} />
									))}
						</div>
					)}
				<div className="c-card__header">
					<h3 className="c-card__title t-h-4">{title}</h3>
					{resStart && (
						<div className={'c-card__badge'}>
							Reservation: {formatTime(resStart)}
						</div>
					)}
				</div>
				{layout == 'horizontal-full' && content && (
					<div className="c-card__content wysiwyg-b-2">
						<CustomPortableText blocks={content} />
					</div>
				)}
				<div className="c-card__actions">
					<Button
						className={clsx('btn-underline', cardColor && `cr-${cardColor}-d`)}
						href={url}
						{...(!hasPressedKeys && {
							onClick: (e) => {
								e.preventDefault();
								setMag({
									slug: slug,
									type: 'location',
									color: cardColor,
								});
							},
						})}
					>
						Details
					</Button>
					<Button
						className={clsx('btn-underline', cardColor && `cr-${cardColor}-d`)}
						href={`https://www.google.com/maps/dir//${encodeURIComponent(addressString)}`}
						target="_blank"
					>
						Get Direction
					</Button>
				</div>
			</div>
		</div>
	);
}
