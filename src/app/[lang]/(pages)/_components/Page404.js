'use client';

import Button from '@/components/Button';
import CustomPortableText from '@/components/CustomPortableText';

export default function Page404({ data }) {
	const { heading, paragraph, callToAction } = data || {};

	return (
		<div className="p-404 f-v f-j-c wysiwyg">
			<h1 className="t-h-1">{heading || 'Page not found'}</h1>
			{paragraph && (
				<p className="t-h-3">
					<CustomPortableText blocks={paragraph} hasPTag={false} />
				</p>
			)}
			{callToAction && (
				<Button
					className={'btn cr-green-d'}
					href={callToAction?.link?.route}
					isNewTab={callToAction.isNewTab}
					// caret="right"
				>
					{callToAction.label}
				</Button>
			)}
		</div>
	);
}
