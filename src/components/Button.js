import React from 'react';
import Link from 'next/link';

export default function Button({
	onClick,
	className = '',
	href,
	target,
	children,
}) {
	const isButton = !href;

	if (isButton) {
		return (
			<button onClick={onClick} className={className}>
				<div className="btn__text">{children}</div>
			</button>
		);
	}

	return (
		<Link onClick={onClick} className={className} href={href} target={target}>
			<span>{children}</span>
		</Link>
	);
}
