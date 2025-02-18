import { hasArrayValue } from '@/lib/helpers';
import clsx from 'clsx';
import Img from '@/components/Image';
import Button from '@/components/Button';
import { format, add, isSameMonth } from 'date-fns';
import Map from '@/components/Map';

export default function LocationCard({
	data,
	layout = 'vertical',
	color = 'green',
	reservation,
}) {
	const { thumb, title, slug, categories, address, subcategories } = data || {};
	const addressString =
		address &&
		Object.values(address)
			.filter((value) => value)
			.join(', ');

	const formatTime = (time) => {
		return format(time, 'h:mm a');
	};
	const resStart = reservation?.startTime && new Date(reservation?.startTime);
	// const resEnd = reservation?.endTime && new Date(reservation?.endTime);
	// const timeRange =
	// 	resStart &&
	// 	(resEnd
	// 		? `${formatTime(resStart)}—${formatTime(resEnd)}`
	// 		: formatTime(resStart));

	return (
		<div className={'c-location-card'} data-layout={layout}>
			<div className="c-location-card__thumb bg-subtle">
				<span className="object-fit">{thumb && <Img image={thumb} />}</span>
			</div>

			<div className="c-location-card__content">
				<div className="c-location-card__header">
					<h3 className="c-location-card__title t-h-4">{title}</h3>
					{resStart && (
						<div className={'c-location-card__reservation'}>
							Reservation: {formatTime(resStart)}
						</div>
					)}
				</div>
				{(hasArrayValue(subcategories) || hasArrayValue(categories)) && (
					<div className="c-location-card__categories t-b-2">
						{(subcategories || categories)
							.map((item) => item.title)
							.join(' • ')}
					</div>
				)}
				<div className="c-location-card__actions">
					<Button
						className={'btn-underline'}
						href={`/locations/${slug}`}
						target="_blank"
					>
						Details
					</Button>
					{addressString && (
						<Button
							className={'btn-underline'}
							href={`https://www.google.com/maps/dir//${encodeURIComponent(addressString)}`}
							target="_blank"
						>
							Get Direction
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}
