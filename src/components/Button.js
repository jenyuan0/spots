import React from 'react';
import Link from '@/components/CustomLink';

function Content({ children, icon, caret, underline }) {
	return (
		<>
			{caret && (
				<div className="btn__caret-hover">
					<span className={`icon-caret-${caret}`} />
				</div>
			)}
			{icon && <div className="btn__icon">{icon}</div>}
			{underline ? children : <div className="btn__text">{children}</div>}
			{caret && (
				<div className="btn__caret">
					<span className={`icon-caret-${caret}`} />
				</div>
			)}
		</>
	);
}

export default function Button({
	children,
	icon,
	caret,
	href,
	className = '',
	...props
}) {
	const underline = className.includes('btn-underline');

	if (href) {
		return (
			<Link className={className} href={href} {...props}>
				<Content icon={icon} caret={caret} underline={underline}>
					{children}
				</Content>
			</Link>
		);
	}

	return (
		<button className={className} {...props}>
			<Content icon={icon} caret={caret} underline={underline}>
				{children}
			</Content>
		</button>
	);
}
