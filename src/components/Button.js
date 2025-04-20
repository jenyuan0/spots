import React from 'react';
import Link from 'next/link';

export default function Button({
	onClick,
	className = '',
	href,
	target,
	children,
	icon,
	caret,
}) {
	const isButton = !href;
	const content = (
		<>
			{caret && (
				<div className="btn__caret-hover">
					<span className={`icon-caret-${caret}`} />
				</div>
			)}
			{icon && <div className="btn__icon">{icon}</div>}
			<div className="btn__text">{children}</div>
			{caret && (
				<div className="btn__caret">
					<span className={`icon-caret-${caret}`} />
				</div>
			)}
		</>
	);

	if (isButton) {
		return (
			<button onClick={onClick} className={className}>
				{content}
			</button>
		);
	}

	return (
		<Link href={href} target={target} className={className} onClick={onClick}>
			{content}
		</Link>
	);
}
