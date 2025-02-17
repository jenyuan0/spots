import { hasArrayValue } from '@/lib/helpers';
import Link from 'next/link';
import Img from '@/components/Image';

export default function GuideCard({ data }) {
	const { title, slug, thumb, publishDate, categories, excerpt } = data || {};

	return (
		<div className="c-guide-card data-card data-block-red">
			{thumb && <Img image={thumb} />}

			<div className="c-guide-card__content">
				{title && <h3 className="c-guide-card__title">{title}</h3>}
				<p>{publishDate}</p>
				{hasArrayValue(categories) && (
					<ul className="c-guide-card__categories">
						{categories.map((item) => {
							const { _id, title } = item;
							return <li key={_id}>{title}</li>;
						})}
					</ul>
				)}
				{excerpt && <p className="c-guide-card__excerpt">{excerpt}</p>}
				<Link href={`/guides/${slug}`}>Your Accomodation</Link>
			</div>
		</div>
	);
}
