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
	const url = `/paris/itinerary/${slug}`;

	return (
		<div
			className={'c-itinerary-card'}
			style={{
				'--cr-primary': `var(--cr-${color?.title || 'brown'}-d)`,
				'--cr-secondary': `var(--cr-${color?.title || 'brown'}-l)`,
			}}
		>
			<div className="c-itinerary-card__header">
				<h3 className="t-l-1">{totalDays} Day Itinerary</h3>
				<h2 className="c-itinerary-card__title t-l-1">{title}</h2>
			</div>
			<div className="c-itinerary-card__thumb" href={url}>
				{images && <Img image={images[0]} className={'child-fit'} />}
			</div>
			<h2 className="c-itinerary-card__subtitle">{subtitle}</h2>
			<Button className="c-itinerary-card__cta btn-outline cr-white" href={url}>
				View Travel Plan
			</Button>
			<Link href={url} ariaLabel="Open Itinerary" className="p-fill" />
		</div>
	);
}
