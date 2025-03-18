import { hasArrayValue } from '@/lib/helpers';
import Link from 'next/link';
import Img from '@/components/Image';
import Button from '@/components/Button';

export default function GuideCard({ data, layout = 'vertical' }) {
	const {
		title,
		slug,
		thumb,
		publishDate,
		categories,
		subcategories,
		excerpt,
	} = data || {};

	return (
		<div className="c-card" data-layout={layout}>
			<div className="c-card__thumb">
				<span className="object-fit">{thumb && <Img image={thumb} />}</span>
			</div>

			<div className="c-card__info">
				<div className="c-card__header">
					<h3 className="c-card__title t-h-4">{title}</h3>
				</div>
				{(hasArrayValue(subcategories) || hasArrayValue(categories)) && (
					<div className="c-card__categories t-b-2">
						{(subcategories || categories)
							.map((item) => item.title)
							.join(' • ')}
					</div>
				)}
				<div className="c-card__actions">
					<Link className={'btn-underline'} href={`/guides/${slug}`}>
						Read
					</Link>
				</div>
			</div>
		</div>
	);
}
