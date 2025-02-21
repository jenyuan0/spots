import clsx from 'clsx';
import { hasArrayValue, formatTime } from '@/lib/helpers';
import Link from 'next/link';
import Img from '@/components/Image';
import Button from '@/components/Button';
import useMagnify from '@/hooks/useMagnify';
import useKey from '@/hooks/useKey';

export default function LocationCard({ data, layout = 'vertical', color }) {
	const { thumb, title, slug, categories, subcategories, geo, address, res } =
		data || {};
	const url = `/locations/${slug}`;
	const addressString =
		address &&
		Object.values(address)
			.filter((value) => value)
			.join(', ');
	const resStart = res?.startTime && new Date(res?.startTime);
	const setMag = useMagnify((state) => state.setMag);
	const { hasPressedKeys } = useKey();

	{
		console.log(hasPressedKeys);
	}

	return (
		<div className={'c-card'} data-layout={layout}>
			<div className="c-card__thumb">
				<span className="object-fit">{thumb && <Img image={thumb} />}</span>
			</div>

			<div className="c-card__content">
				<div className="c-card__header">
					<h3 className="c-card__title t-h-4">{title}</h3>
					{resStart && (
						<div className={'c-card__badge'}>
							Reservation: {formatTime(resStart)}
						</div>
					)}
				</div>
				{(hasArrayValue(subcategories) || hasArrayValue(categories)) && (
					<div className="c-card__categories t-b-2">
						{(subcategories || categories)
							.map((item) => item.title)
							.join(' • ')}
					</div>
				)}
				<div className="c-card__actions">
					<Button
						className={clsx('btn-underline', color && `cr-${color}-d`)}
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

					<Link
						className={clsx('btn-underline', color && `cr-${color}-d`)}
						href={`https://www.google.com/maps/dir//${encodeURIComponent(addressString)}`}
						target="_blank"
					>
						Get Direction
					</Link>
				</div>
			</div>
		</div>
	);
}
