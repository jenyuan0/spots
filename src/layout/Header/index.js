import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { scrollEnable, scrollDisable } from '@/lib/helpers';
import { checkIfActive } from '@/lib/routes';
import Link from '@/components/CustomLink';
import MobileMenuTrigger from './mobile-menu-trigger';
import Button from '@/components/Button';
import { motion } from 'framer-motion';

const leftNav = [
	{
		title: 'Explore Paris',
		url: '/paris',
	},
	{
		title: 'Guides',
		url: '/paris/guides',
		// hasCaret: true,
	},
	{
		title: 'Locations',
		url: '/paris/locations',
		// hasCaret: true,
	},
];

const rightNav = [
	{
		title: 'Book a Hotel',
		url: '/book-a-hotel',
	},
	{
		title: 'Ready-to-book Trips',
		url: '/paris/ready-to-book-trips',
	},
];

function NavLink({ nav }) {
	const pathname = usePathname();

	return (
		<ul className="g-header__nav__links user-select-disable">
			{nav.map((item, index) => {
				// TODO
				// Active state
				// Megamenu
				const isActive = false;
				// const isActive = checkIfActive({
				// 	pathname,
				// 	url: item.url,
				// });

				// console.log(pathname, item.url);

				return (
					<li
						key={`${item.title}-${index}`}
						className={clsx({ 'is-active': isActive })}
					>
						<Link href={item?.url} className={'increase-target-size'}>
							{item?.title}
							{item.hasCaret && (
								<>
									{' '}
									<span className="icon-caret-down" />
								</>
							)}
						</Link>
					</li>
				);
			})}
		</ul>
	);
}
const FrenchFlag = () => {
	const dotVariants = {
		hover: (i) => ({
			y: [0, -8, 0],
			transition: {
				duration: 1.2,
				repeat: Infinity,
				ease: 'easeInOut',
				delay: i * 0.2,
			},
		}),
	};

	return (
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
	);
};

export default function Header({ data, isActive }) {
	const pathname = usePathname();
	const ref = useRef();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		document.documentElement.style.setProperty(
			'--s-header',
			`${ref?.current?.offsetHeight || 0}px`
		);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const onToggleMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
		isMobileMenuOpen ? scrollEnable() : scrollDisable();
	};

	useEffect(() => {
		setIsMobileMenuOpen(false);
	}, [pathname]);

	return (
		<>
			<header
				ref={ref}
				className={clsx('g-header', 'use-select-disable', {
					'is-scrolled': isScrolled,
					'is-active': isActive,
				})}
			>
				<div className="g-header__primary">
					<Link href={'/'} className="g-header__logo t-h-3">
						SPOTS
					</Link>
					<div className="g-header__primary__center">
						<motion.div className="g-header__tagline t-h-5" whileHover="hover">
							<FrenchFlag />
							An ever-growing collection of Parisian treasures refreshed weekly
						</motion.div>
						<div
							className="g-header__primary__nav t-l-1"
							aria-hidden={isScrolled}
						>
							<NavLink nav={leftNav} />
							<NavLink nav={rightNav} />
						</div>
					</div>
					<Button
						className="g-header__cta btn cr-green-d"
						caret="right"
						href={'/contact'}
					>
						Contact
					</Button>
				</div>
				<div className="g-header__nav t-l-1" aria-hidden={!isScrolled}>
					<NavLink nav={leftNav} />
					<NavLink nav={rightNav} />
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
