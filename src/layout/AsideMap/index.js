import React, { Suspense, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Map from '@/components/Map';
import Button from '@/components/Button';
import useAsideMap from '@/hooks/useAsideMap';

export default function AsideMap() {
	const color = 'green';
	const { locations, asideMapActive, asideMapExpand, setAsideMapExpand } =
		useAsideMap();

	return (
		<div
			className={clsx('g-aside-map', {
				'is-active': asideMapActive,
				'is-expand': asideMapExpand,
			})}
			style={{
				'--cr-primary': `var(--cr-${color}-d)`,
				'--cr-secondary': `var(--cr-${color}-l)`,
			}}
			role="dialog"
			aria-modal={asideMapActive}
		>
			<Map locations={locations} />
			<button
				type="button"
				className="g-aside-map__toggle"
				onClick={() => {
					setAsideMapExpand(!asideMapExpand);
					console.log(asideMapExpand);
				}}
			>
				<div className="g-aside-map__toggle__icon icon-caret-left" />
			</button>
		</div>
	);
}
