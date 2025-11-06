import React from 'react';
import Link from '@/components/CustomLink';
import { useCurrentLang } from '@/hooks/useCurrentLang';

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
	isNewTab,
	className = '',
	...props
}) {
	const underline = className.includes('btn-underline');
	const isMailTo = href?.match('^mailto:');
	const [currentLanguageCode] = useCurrentLang();

	if (href) {
		return (
			<Link
				className={className}
				href={`${isMailTo ? '' : `/${currentLanguageCode}`}${href}`}
				isNewTab={isNewTab}
				{...props}
			>
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
