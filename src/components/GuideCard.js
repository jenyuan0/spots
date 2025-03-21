import clsx from 'clsx';
import { hasArrayValue } from '@/lib/helpers';
import Img from '@/components/Image';
import Button from '@/components/Button';
import Link from '@/components/CustomLink';
import CategoryPill from '@/components/CategoryPill';

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
				<span className="object-fit">{thumb && <Img image={thumb} />}</span>
			</div>

			<div className="c-card__info">
				{layout !== 'horizontal' &&
					(hasArrayValue(categories) || hasArrayValue(subcategories)) && (
						<div className="c-card__categories">
							{categories?.slice(0, 3).map((item) => (
								<CategoryPill
									className="pill"
									key={`category-${item._id}`}
									data={item}
								/>
							))}
							{categories?.length < 3 &&
								subcategories
									?.slice(0, 3 - categories.length)
									.map((item) => (
										<CategoryPill
											className="pill"
											key={`subcategory-${item._id}`}
											data={item}
										/>
									))}
						</div>
					)}
				<div className="c-card__header">
					<h3 className="c-card__title t-h-4">
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
		</div>
	);
}
