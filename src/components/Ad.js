import React from 'react';
import CustomPortableText from '@/components/CustomPortableText';
import Img from '@/components/Image';
import Link from '@/components/CustomLink';

export default function Ad({ data }) {
	const { title, content, image, newsletterID, callToAction } = data;

	return (
		<div className="c-ad">
			<h3 className="t-h-3">{title}</h3>
			<div className="c-ad-content wysiwyg">
				<CustomPortableText blocks={content} />
				{callToAction && (
					<Link
						link={callToAction?.link}
						isNewTab={callToAction?.isNewTab}
						className="btn-underline"
					>
						{callToAction.label}
					</Link>
				)}
			</div>
			{image && <Img image={image} />}
		</div>
	);
}
