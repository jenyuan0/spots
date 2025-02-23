import React from 'react';
import Link from '@/components/CustomLink';
import { PortableText } from '@portabletext/react';

const tablePortableTextComponents = {
	list: {
		bullet: ({ children }) => <ul>{children}</ul>,
		number: ({ children }) => <ol>{children}</ol>,
	},
	marks: {
		link: ({ value, children }) => {
			return (
				<Link href={value?.route} isNewTab={value?.isNewTab}>
					{children}
				</Link>
			);
		},
	},
};

export default function TablePortableText({ blocks }) {
	if (!blocks) return null;

	return (
		<PortableText value={blocks} components={tablePortableTextComponents} />
	);
}
