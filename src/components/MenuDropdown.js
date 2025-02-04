import clsx from 'clsx';
import React, { useState } from 'react';
import CustomLink from '@/components/CustomLink';
import { usePathname } from 'next/navigation';
import { checkIfActive } from '@/lib/routes';

export default function MenuDropdown({ title, items }) {
	const [isOpen, setIsOpen] = useState(false);
	const pathName = usePathname();

	return (
		<>
			<div className={clsx('dropdown', { 'is-open': isOpen })}>
				<button
					type="button"
					className="dropdown-toggle"
					aria-expanded={isOpen}
					onClick={() => setIsOpen(!isOpen)}
				>
					{title}
				</button>
				<div className="dropdown-content">
					<ul className="dropdown-nav">
						{items.map((item, index) => {
							const { link, title } = item || {};
							const isActive = checkIfActive({
								pathName: pathName,
								url: link.route,
							});

							return (
								<li key={index} className={clsx({ 'is-active': isActive })}>
									<CustomLink
										tabIndex={!isOpen ? -1 : null}
										link={link}
										title={title}
									/>
								</li>
							);
						})}
					</ul>
				</div>
			</div>
			<style jsx>{`
				.dropdown {
					&.is-open {
						.dropdown-content {
							opacity: 1;
							pointer-event: auto;
						}
					}
				}
				.dropdown-content {
					opacity: 0;
					pointer-event: none;
				}
				.dropdown-nav {
					position: absolute;
				}
			`}</style>
		</>
	);
}
