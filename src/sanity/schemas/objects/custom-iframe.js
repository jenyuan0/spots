'use client';
import React from 'react';
import { LinkIcon } from '@sanity/icons';

const Preview = (props) => {
	const { embedSnippet, renderDefault } = props;
	if (!embedSnippet) {
		return React.createElement('div', null, 'Missing Embed Snippet');
	}

	return React.createElement(
		'div',
		{ className: 'iframe-preview' },
		renderDefault({ ...props, title: 'Iframe Embed' }),
		React.createElement('div', {
			dangerouslySetInnerHTML: { __html: embedSnippet },
		}),
		React.createElement(
			'style',
			{ jsx: true },
			`
			:global(.iframe-preview iframe) {
				width: 100%;
			}
		`
		)
	);
};

export default function customIframe({ ...props } = {}) {
	return {
		type: 'object',
		title: 'Iframe',
		name: 'iframe',
		icon: LinkIcon,
		fields: [{ title: 'Embed Snippet', name: 'embedSnippet', type: 'text' }],
		preview: {
			select: {
				embedSnippet: 'embedSnippet',
			},
		},
		components: {
			preview: Preview,
		},
		...props,
	};
}
