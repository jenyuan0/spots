import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link';
import React from 'react';

export { NextLink };
export default function CustomLink({
	link,
	title,
	children,
	className,
	ariaLabel,
	isNewTab,
	isButton,
	...props
}) {
	const router = useRouter();

	if (!link.route) return null;

	const { route } = link;
	const isOpenNewTab = isNewTab ?? link.isNewTab;

	const onHandleClick = (event) => {
		if (
			document.startViewTransition &&
			!isOpenNewTab &&
			!(event.metaKey || event.ctrlKey)
			// Check if the Command key (on Mac) or Control key (on Windows/Linux) is pressed
		) {
			event.preventDefault();
			document.startViewTransition(() => {
				router.push(route);
			});
		}
	};

	return (
		<NextLink
			href={route}
			target={route?.match('^mailto:') || isOpenNewTab ? '_blank' : null}
			rel={isOpenNewTab ? 'noopener noreferrer' : null}
			aria-label={ariaLabel || `${title || `Go to ${route}`}`}
			className={clsx(className, {
				btn: isButton,
			})}
			{...props}
			onClick={onHandleClick}
		>
			{title || children}
		</NextLink>
	);
}
