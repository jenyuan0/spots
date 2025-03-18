import React from 'react';
import clsx from 'clsx';
import Map from '@/components/Map';
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
			{locations && <Map locations={locations} />}
			<button
				type="button"
				className="g-aside-map__toggle"
				onClick={() => {
					setAsideMapExpand(!asideMapExpand);
				}}
			>
				<div className="g-aside-map__toggle__icon">
					<div className="icon-caret-left" />
				</div>
				<div className="g-aside-map__toggle__label t-l-1">
					{asideMapExpand ? 'Collapse' : 'Expand'} Map
				</div>
			</button>
		</div>
	);
}
