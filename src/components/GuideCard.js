import clsx from 'clsx';
import { hasArrayValue } from '@/lib/helpers';
import Img from '@/components/Image';
import Button from '@/components/Button';
import Link from '@/components/CustomLink';
import CategoryPillList from '@/components/CategoryPillList';

export default function GuideCard({ data, layout = 'vertical-1', color }) {
	const {
		title,
		slug,
		thumb,
		publishDate,
		categories,
		subcategories,
		excerpt,
	} = data || {};
	const url = `/paris/guides/${slug}`;

	return (
		<div
			className={'c-card'}
			data-layout={layout}
			style={
				color && {
					'--cr-card-text': `var(--cr-cream)`,
					'--cr-card-bg': `var(--cr-${color}-d)`,
				}
			}
		>
			<div className="c-card__thumb">
				<div className="object-fit">{thumb && <Img image={thumb} />}</div>
			</div>
			<div className="c-card__info">
				{layout !== 'horizontal' &&
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
							't-h-4': layout === 'vertical-1',
							't-h-3': layout === 'vertical-2',
							't-h-5': layout === 'horizontal-1',
							't-h-2': layout === 'horizontal-2',
						})}
					>
						{title}
					</h3>
				</div>
				{excerpt && layout == 'horizontal-2' && (
					<p className="c-card__excerpt t-b-1">{excerpt}</p>
				)}
				<div className="c-card__actions">
					<Button
						className={clsx('btn-underline', {
							'cr-cream': color,
						})}
						href={url}
					>
						Read Guide
					</Button>
				</div>
			</div>
			<Link href={url} ariaLabel="Open Guide" className="p-fill" />
		</div>
	);
}
