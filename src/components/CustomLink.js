import React from 'react';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import useKey from '@/hooks/useKey';

// Add prop validation
const isValidRoute = (route) => {
	return typeof route === 'string' && route.length > 0;
};

export default function CustomLink({
	href,
	title,
	children,
	className,
	ariaLabel,
	isNewTab,
	onClick,
	...props
}) {
	if (!href || !isValidRoute(href)) return null;

	const router = useRouter();
	const { hasPressedKeys } = useKey();
	const isMailTo = href?.match('^mailto:');

	const handleClick = (event) => {
		onClick?.(event);

		if (event.defaultPrevented) return;

		if (document.startViewTransition && !isNewTab && !hasPressedKeys) {
			event.preventDefault();
			document.startViewTransition(() => {
				router.push(href);
			});
		}
	};

	return (
		<NextLink
			href={href}
			target={isMailTo || isNewTab ? '_blank' : undefined}
			rel={isNewTab ? 'noopener noreferrer' : undefined}
			aria-label={ariaLabel}
			className={className}
			onClick={handleClick}
			{...props}
		>
			{title || children}
		</NextLink>
	);
}
