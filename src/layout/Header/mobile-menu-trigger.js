import React from 'react';
import clsx from 'clsx';

export default function MobileMenuTrigger({
	isMobileMenuOpen,
	onHandleClick,
	localization,
}) {
	const { menuLabel } = localization || {};

	return (
		<button
			aria-label="Toggle Menu"
			className={clsx('g-mobile-menu-trigger', {
				'is-mobile-open': isMobileMenuOpen,
			})}
			onClick={onHandleClick}
		>
			<div className="g-mobile-menu-trigger__lines">
				<div className="g-mobile-menu-trigger__line" />
				<div className="g-mobile-menu-trigger__line" />
				<div className="g-mobile-menu-trigger__line" />
			</div>
			<span className="t-l-2">{menuLabel}</span>
		</button>
	);
}
