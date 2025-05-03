import React from 'react';
import clsx from 'clsx';
import Map from '@/components/Map';
import useAsideMap from '@/hooks/useAsideMap';

export default function AsideMap() {
	const color = 'green';
	const { locations, asideMapActive, asideMapExpand, setAsideMapExpand } =
		useAsideMap();

	// TODO
	// Dynamically set toggle color based on the most popular location color

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
			aria-label="Locations map"
			aria-modal={asideMapActive}
		>
			{locations && <Map locations={locations} />}
			<button
				type="button"
				className="g-aside-map__toggle"
				onClick={() => {
					setAsideMapExpand(!asideMapExpand);
				}}
			>
				<div className="g-aside-map__toggle__label pill">
					{asideMapExpand ? 'Collapse' : 'Expand'} Map
				</div>
				<div className="g-aside-map__toggle__icon trigger">
					<div className="icon-caret-left" />
				</div>
			</button>
		</div>
	);
}
