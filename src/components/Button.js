import React from 'react';
import Link from 'next/link';

export default function Button({ children, icon, caret, ...props }) {
	const { href } = props;
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
		return <button {...props}>{content}</button>;
	}

	return <Link {...props}>{content}</Link>;
}
