import CustomLink from '@/components/CustomLink';
import { hasArrayValue } from '@/lib/helpers';

export default function BlogCard({ data }) {
	const { title, excerpt, slug, author, categories } = data || {};

	return (
		<div className="c-blog-card">
			{title && <h3 className="c-blog-card__title">{title}</h3>}
			{author && <p className="c-blog-card__author">{author.name}</p>}
			{hasArrayValue(categories) && (
				<ul className="c-blog-card__categories">
					{categories.map((item) => {
						const { _id, title } = item;
						return <li key={_id}>{title}</li>;
					})}
				</ul>
			)}
			{excerpt && <p className="c-blog-card__excerpt">{excerpt}</p>}
			<CustomLink link={{ route: `/blog/${slug}` }}>Read More</CustomLink>
		</div>
	);
}
