import React, { Suspense, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Map from '@/components/Map';
import Button from '@/components/Button';

export default function AsideMap() {
	const [isActive, setIsActive] = useState(true);
	const color = 'green';

	return (
		<div
			className={clsx('g-map', { 'is-active': isActive })}
			style={{
				'--cr-primary': `var(--cr-${color}-d)`,
				'--cr-secondary': `var(--cr-${color}-l)`,
			}}
			role="dialog"
			aria-modal={isActive}
		>
			<Map />
		</div>
	);
}
