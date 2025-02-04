import CustomLink from '@/components/CustomLink';
import { hasArrayValue } from '@/lib/helpers';

export default function GuideCard({ data }) {
	const { title, excerpt, slug, author, categories } = data || {};

	return (
		<div className="c-guides-card">
			{title && <h3 className="c-guides-card__title">{title}</h3>}
			{author && <p className="c-guides-card__author">{author.name}</p>}
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
	);
}
