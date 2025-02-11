import CustomLink from '@/components/CustomLink';
import { hasArrayValue } from '@/lib/helpers';
import Img from '@/components/Image';

export default function LocationCard({ data }) {
	const { images, title, excerpt, slug, categories } = data || {};

	return (
		<div className="c-locations-card data-card data-block-blue">
			{images && <Img image={images[0]} />}
			<div className="c-locations-card__content">
				{title && <h3 className="c-locations-card__title">{title}</h3>}
				{hasArrayValue(categories) && (
					<ul className="c-locations-card__categories">
						{categories.map((item) => {
							const { _id, title } = item;
							return <li key={_id}>{title}</li>;
						})}
					</ul>
				)}
				{excerpt && <p className="c-locations-card__excerpt">{excerpt}</p>}
				<CustomLink link={{ route: `/locations/${slug}` }}>
					Read More
				</CustomLink>
			</div>
		</div>
	);
}
