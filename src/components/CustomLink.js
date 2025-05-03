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
	link,
	title,
	children,
	isNewTab,
	onClick,
	...props
}) {
	const router = useRouter();
	const { hasPressedKeys } = useKey();

	if (!isValidRoute(href || link?.route)) return null;

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
			href={href || link.route}
			target={isMailTo || isNewTab ? '_blank' : undefined}
			rel={isNewTab ? 'noopener noreferrer' : undefined}
			onClick={handleClick}
			title={title}
			{...props}
		>
			children
		</NextLink>
	);
}
