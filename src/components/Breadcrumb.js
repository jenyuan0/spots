import React from 'react';
import Link from '@/components/CustomLink';

export default function Breadcrumb({ data }) {
	console.log('🚀 ~ Breadcrumb ~ data:', data);
	return (
		<ul className="c-breadcrumb t-l-2">
			{data.map((item, index) => {
				if (!item.url && !item.title) return null;
				return (
					<li key={`breadcrumb-${index}`}>
						<Link href={item.url}>{item.title}</Link>
						{index < data.length - 1 && (
							<span className="c-breadcrumb__divider">/</span>
						)}
					</li>
				);
			})}
		</ul>
	);
}
