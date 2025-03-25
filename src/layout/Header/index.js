import React, { useEffect, useState, useId } from 'react';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { scrollEnable, scrollDisable } from '@/lib/helpers';
import { checkIfActive } from '@/lib/routes';
import Link from '@/components/CustomLink';
import MobileMenuTrigger from './mobile-menu-trigger';
import Button from '@/components/Button';

function HeaderLinks({ title, items }) {
	const baseId = useId();
	const pathName = usePathname();

	return (
		<div className="g-header__links">
			{/* {title && <div className="g-header__links__title t-l-2">{title}</div>} */}
			{items && (
				<ul className="g-header__links__ul t-h-5">
					{items.map((el, i) => {
						const { link, title } = el;
						const isActive = checkIfActive({
							pathName: pathName,
							url: link?.route,
						});

						return (
							<li
								key={`link-${baseId}-${i}`}
								className={clsx({ 'is-active': isActive })}
							>
								<Link href={link.route}>{title}</Link>
							</li>
						);
					})}
				</ul>
			)}
		</div>
	);
}

import { motion } from 'framer-motion';

export default function Header({ data, isActive }) {
	const pathname = usePathname();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const onToggleMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
		isMobileMenuOpen ? scrollEnable() : scrollDisable();
	};

	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [pathname]);

	const dotVariants = {
		hover: (i) => ({
			y: [0, -8, 0, 0, 0],
			transition: {
				duration: 1.6,
				repeat: Infinity,
				ease: 'easeInOut',
				delay: i * 0.2,
			},
		}),
	};

	return (
		<>
			<header className={clsx('g-header', { 'is-active': isActive })}>
				<div className="g-header__primary">
					<h1 className="g-header__logo t-h-2">
						<Link href={'/'}>SPOTS</Link>
					</h1>

					{data?.menu?.map((el, i) => (
						<HeaderLinks
							key={`header-link-${i}`}
							title={el?.title}
							items={el?.items}
						/>
					))}
					<Button className="btn-outline cr-white">Get in Touch</Button>
				</div>

				<div className="g-header__nav t-l-1">
					<Link href={'/paris/guides'}>
						Guides <span className="icon-caret-down" />
					</Link>
					<Link href={'/paris/locations'}>
						Spots <span className="icon-caret-down" />
					</Link>

					<motion.div className="g-header__subheading" whileHover="hover">
						<div className="g-header__flag">
							{[0, 1, 2].map((i) => (
								<motion.div
									key={i}
									className="g-header__flag-dot"
									custom={i}
									variants={dotVariants}
								/>
							))}
						</div>
						<div className="t-h-5">
							An ever-growing collection of Parisian treasures, refreshed weekly
						</div>
					</motion.div>
				</div>
			</header>

			<div
				className={clsx('g-mobile-menu p-fill bg-white', {
					'is-open': isMobileMenuOpen,
				})}
			>
				<MobileMenuTrigger
					isMobileMenuOpen={isMobileMenuOpen}
					onHandleClick={onToggleMenu}
				/>
			</div>
		</>
	);
}
