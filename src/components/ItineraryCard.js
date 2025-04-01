import clsx from 'clsx';
import { hasArrayValue, formatTime } from '@/lib/helpers';
import Img from '@/components/Image';
import Button from '@/components/Button';
import Link from '@/components/CustomLink';

export default function ItineraryCard({ data }) {
	const {
		title,
		subtitle,
		slug,
		images,
		color,
		totalDays,
		totalActivities,
		totalLocations,
	} = data || {};
	const url = `/paris/itineraries/${slug}`;

	return (
		<div
			className={'c-itinerary-card'}
			style={{ '--cr-primary': color?.colorD, '--cr-secondary': color?.colorL }}
		>
			<div className="c-itinerary-card__header wysiwyg">
				<h2 className="t-l-2">
					<Link href={url}>{title}</Link>
				</h2>
				<h3 className="t-h-2">
					<Link href={url}>{subtitle}</Link>
				</h3>
			</div>
			<Link className="c-itinerary-card__thumb" href={url}>
				{images && <Img image={images[0]} className={'child-fit'} />}
			</Link>
			<div className="c-itinerary-card__footer wysiwyg">
				<h3 className="t-h-3">
					<span className="t-b-1">{totalDays}</span> Day{totalDays > 1 && 's'}
					{' & '}
					<span className="t-b-1">{totalActivities}</span> Spot
					{totalActivities > 1 && 's'}
				</h3>
				<Button
					className="c-itinerary-card__cta btn-outline cr-white"
					href={url}
				>
					View Itinerary
				</Button>
			</div>
		</div>
	);
}
