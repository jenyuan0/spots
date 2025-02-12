import CustomLink from '@/components/CustomLink';
import { hasArrayValue } from '@/lib/helpers';
import Img from '@/components/Image';

export default function GuideCard({ data }) {
	const { title, slug, thumb, publishDate, categories, excerpt } = data || {};

	return (
		<div className="c-guides-card data-card data-block-red">
			{thumb && <Img image={thumb} />}

			<div className="c-guides-card__content">
				{title && <h3 className="c-guides-card__title">{title}</h3>}
				<p>{publishDate}</p>
				{hasArrayValue(categories) && (
					<ul className="c-guides-card__categories">
						{categories.map((item) => {
							const { _id, title } = item;
							return <li key={_id}>{title}</li>;
						})}
					</ul>
				)}
				{excerpt && <p className="c-guides-card__excerpt">{excerpt}</p>}
				<CustomLink link={{ route: `/guides/${slug}` }}>Read More</CustomLink>
			</div>
		</div>
	);
}
