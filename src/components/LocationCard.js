import { add, isSameMonth } from 'date-fns';
import { hasArrayValue, formatTime } from '@/lib/helpers';
import Link from 'next/link';
import Img from '@/components/Image';
import Button from '@/components/Button';
import { create } from 'zustand';

const useStore = create((set) => ({
	magnify: 0,
	increasePopulation: () => set((state) => ({ magnify: state.magnify + 1 })),
	removeAllMag: () => set({ magnify: 0 }),
	updateMag: (newMag) => set({ magnify: newMag }),
}));

export default function LocationCard({ data, layout = 'vertical' }) {
	const { thumb, title, slug, categories, subcategories, address, res } =
		data || {};
	const addressString =
		address &&
		Object.values(address)
			.filter((value) => value)
			.join(', ');
	const resStart = res?.startTime && new Date(res?.startTime);
	// const resEnd = res?.endTime && new Date(res?.endTime);
	// const timeRange =
	// 	resStart &&
	// 	(resEnd
	// 		? `${formatTime(resStart)}—${formatTime(resEnd)}`
	// 		: formatTime(resStart));

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
						className={'btn-underline'}
						href={`/locations/${slug}`}
						target="_blank"
					>
						Details
					</Button>
					{addressString && (
						<Link
							className={'btn-underline'}
							href={`https://www.google.com/maps/dir//${encodeURIComponent(addressString)}`}
							target="_blank"
						>
							Get Direction
						</Link>
					)}
				</div>
			</div>
		</div>
	);
}
