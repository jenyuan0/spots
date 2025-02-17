import { hasArrayValue } from '@/lib/helpers';
import clsx from 'clsx';
import Img from '@/components/Image';
import Button from '@/components/Button';
import { format, add, isSameMonth } from 'date-fns';
import { endWith } from 'rxjs';

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
	const resEnd = reservation?.endTime && new Date(reservation?.endTime);
	const timeRange =
		resStart &&
		(resEnd
			? `${formatTime(resStart)}—${formatTime(resEnd)}`
			: formatTime(resStart));

	return (
		<div className={'c-location-card'} data-layout={layout}>
			<div className="c-location-card__thumb">
				<span className="object-fit">{thumb && <Img image={thumb} />}</span>
			</div>

			<div className="c-location-card__content">
				{title && <h3 className="c-location-card__title t-h-4">{title}</h3>}
				{(hasArrayValue(subcategories) || hasArrayValue(categories)) && (
					<div className="c-location-card__categories t-b-2">
						{(subcategories || [])
							.concat(categories)
							.map((item) => item.title)
							.join(' • ')}
					</div>
				)}
				<div className="c-location-card__actions">
					{timeRange ? (
						<Button
							className={clsx(
								'btn-outline',
								'size-small',
								color && `cr-${color}-d`
							)}
							href={`/locations/${slug}`}
							target="_blank"
						>
							Reservation at {timeRange}
						</Button>
					) : (
						<Button
							className={clsx(
								'btn-outline',
								'size-small',
								color && `cr-${color}-d`
							)}
							href={`/locations/${slug}`}
							target="_blank"
						>
							More Details
						</Button>
					)}
					{addressString && (
						<Button
							className={clsx('btn-underline', color && `cr-${color}-d`)}
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
