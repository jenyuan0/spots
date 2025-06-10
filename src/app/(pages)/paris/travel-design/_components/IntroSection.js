'use client';

import React from 'react';
import clsx from 'clsx';
import CustomPortableText from '@/components/CustomPortableText';
import Button from '@/components/Button';

export default function IntroSection({ data }) {
	const { introTitle, introHeading, introCta } = data || {};

	return (
		<section
			className="p-home__intro wysiwyg"
			style={{ '--cr-primary': `var(--cr-red-d)` }}
		>
			{introTitle && (
				<h2 className="p-home__intro__title t-l-1">{introTitle}</h2>
			)}
			{introHeading && (
				<p className="t-h-2">
					<CustomPortableText blocks={introHeading} hasPTag={false} />
				</p>
			)}
			{/* {introCta && (
				<Button
					className={clsx('btn-outline', `cr-${primaryColor}-d`)}
					link={introCta?.link}
					isNewTab={introCta?.isNewTab}
				>
					{introCta.label}
				</Button>
			)} */}
		</section>
	);
}
