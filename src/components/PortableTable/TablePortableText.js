import React from 'react';
import CustomLink from '@/components/CustomLink';
import { PortableText } from '@portabletext/react';

const tablePortableTextComponents = {
	list: {
		bullet: ({ children }) => <ul>{children}</ul>,
		number: ({ children }) => <ol>{children}</ol>,
	},
	marks: {
		link: ({ value, children }) => {
			return <CustomLink link={value}>{children}</CustomLink>;
		},
	},
};

export default function TablePortableText({ blocks }) {
	if (!blocks) return null;

	return (
		<PortableText value={blocks} components={tablePortableTextComponents} />
	);
}
