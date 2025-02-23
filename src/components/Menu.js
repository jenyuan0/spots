import React from 'react';
import clsx from 'clsx';
import Link from '@/components/CustomLink';
import { usePathname } from 'next/navigation';
import { checkIfActive } from '@/lib/routes';

export default function Menu({ items, className, ulClassName }) {
	const pathName = usePathname();

	if (!items) {
		return false;
	}

	return (
		<div className={className || ''}>
			<ul className={ulClassName || ''}>
				{items.map((item, index) => {
					const { link } = item || {};

					if (!link?.route) {
						return null;
					}

					const isActive = checkIfActive({
						pathName: pathName,
						url: link.route,
					});

					return (
						<li key={index} className={clsx({ 'is-active': isActive })}>
							<Link href={link.route} isNewTab={link.isNewTab}>
								{item.title}
							</Link>
						</li>
					);
				})}
			</ul>
		</div>
	);
}
