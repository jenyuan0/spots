import React from 'react';
import Link from 'next/link';

export default function Button({
	onClick,
	className = '',
	href,
	target,
	icon,
	children,
}) {
	const isButton = !href;

	const content = (
		<>
			{icon && <div className="btn__icon">{icon}</div>}
			<div className="btn__text">{children}</div>
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
