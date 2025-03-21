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
			{title && <div className="g-header__links__title t-l-2">{title}</div>}
			{items && (
				<ul className="g-header__links__ul t-h-4">
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
				<div className="g-header__logo">
					<h1 className="t-h-2">
						<Link href={'/'}>SPOTS</Link>
					</h1>
				</div>

				<motion.div whileHover="hover">
					<Link className="g-header__destination" href={'/paris'}>
						<div className="g-header__destination__label t-h-4">
							Explore Paris
						</div>
						<div className="g-header__destination__flag">
							{[0, 1, 2].map((i) => (
								<motion.div
									key={i}
									className="g-header__destination__flag-dot"
									custom={i}
									variants={dotVariants}
								/>
							))}
						</div>
					</Link>
				</motion.div>

				{data?.menu?.map((el, i) => (
					<HeaderLinks
						key={`header-link-${i}`}
						title={el?.title}
						items={el?.items}
					/>
				))}
				<div className="g-header__cta">
					<Button className="btn">Get in Touch</Button>
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
