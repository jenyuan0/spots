import React from 'react';
import clsx from 'clsx';
import CustomLink from '@/components/CustomLink';
import Dropdown from '@/components/MenuDropdown';
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
					const { link, dropdownItems } = item || {};
					const isDropdown = !!dropdownItems;

					if (isDropdown) {
						const isActive =
							dropdownItems.filter((item) => {
								return checkIfActive({
									pathName: pathName,
									url: link.route,
								});
							}).length > 0;

						return (
							<li key={index} className={clsx({ 'is-active': isActive })}>
								<Dropdown title={item.title} items={item.dropdownItems} />
							</li>
						);
					}

					if (!link?.route) {
						return null;
					}

					const isActive = checkIfActive({
						pathName: pathName,
						url: link.route,
					});

					return (
						<li key={index} className={clsx({ 'is-active': isActive })}>
							<CustomLink link={link} title={item.title} />
						</li>
					);
				})}
			</ul>
		</div>
	);
}
