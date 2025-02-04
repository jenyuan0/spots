'use client';

import React from 'react';
import CustomPortableText from '@/components/CustomPortableText';
import { hasArrayValue } from '@/lib/helpers';
import BlogCard from '@/components/BlogCard';

export default function PageBlogSingle({ data }) {
	const { title, content, defaultRelatedBlogs } = data || {};

	return (
		<>
			<section className="p-blog-single">
				<h1 className="p-blog-single__title">{title}</h1>
				<div className="p-blog-single__content wysiwyg-page">
					<CustomPortableText blocks={content} />
				</div>
			</section>

			{hasArrayValue(defaultRelatedBlogs) && (
				<section className="p-blog-related">
					<h2 className="p-blog-related__title">Related Articles</h2>
					<div className="p-blog-related__content">
						{defaultRelatedBlogs.map((item) => (
							<BlogCard key={item._id} data={item} />
						))}
					</div>
				</section>
			)}
		</>
	);
}
