import clsx from 'clsx';
import React from 'react';

import CustomPortableText from '@/components/CustomPortableText';
import { buildRgbaCssString } from '@/lib/helpers';

export default function Freeform({ data, className }) {
	const { content, sectionAppearance } = data;

	const {
		backgroundColor,
		textColor,
		textAlign = 'left',
		maxWidth = 100,
		spacingTop = 0,
		spacingBottom = 0,
		spacingTopMobile = spacingTop,
		spacingBottomMobile = spacingBottom,
	} = sectionAppearance;

	const isPadding = !!backgroundColor;
	const sectionStyle = {
		'--text-color': buildRgbaCssString(textColor) || 'inherit',
		'--background-color': buildRgbaCssString(backgroundColor) || 'transparent',
		'--max-width': `${maxWidth}%`,
		'--spacing-top': `${spacingTop}px`,
		'--spacing-bottom': `${spacingBottom}px`,
		'--spacing-top-mobile': `${spacingTopMobile || spacingTop}px`,
		'--spacing-bottom-mobile': `${spacingBottomMobile || spacingBottom}px`,
	};

	return (
		<section
			className={clsx(
				'c-free-form',
				'wysiwyg',
				`text-align-${textAlign || 'none'}`,
				className,
				{
					'with-padding': isPadding,
					'with-margin': !isPadding,
				}
			)}
			style={sectionStyle}
		>
			<CustomPortableText blocks={content} />
		</section>
	);
}
