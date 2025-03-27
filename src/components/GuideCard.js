import clsx from 'clsx';
import { hasArrayValue } from '@/lib/helpers';
import Img from '@/components/Image';
import Button from '@/components/Button';
import Link from '@/components/CustomLink';
import CategoryPillList from '@/components/CategoryPillList';

export default function GuideCard({ data, layout = 'vertical', color }) {
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
		<div className="c-card" data-layout={layout}>
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
								limit={3}
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
						<Link href={url}>{title}</Link>
					</h3>
				</div>
				<div className="c-card__actions">
					<Button
						className={clsx('btn-underline', color && `cr-${color}-d`)}
						href={url}
					>
						Read
					</Button>
				</div>
			</div>

			<Link href={url} ariaLabel="Open Guide" className="p-fill" />
		</div>
	);
}
