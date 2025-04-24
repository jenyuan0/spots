import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { scrollEnable, scrollDisable } from '@/lib/helpers';
import Link from '@/components/CustomLink';
import MobileMenuTrigger from './mobile-menu-trigger';
import Button from '@/components/Button';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { checkIfActive } from '@/lib/routes';

// TODO
// Megamenu

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
		title: 'Our Service',
		url: '/',
	},
	{
		title: 'Ready-to-book Trips',
		url: '/paris/ready-to-book-trips',
	},
];

function NavLink({ nav, pathname }) {
	return (
		<ul className="g-header__links t-l-2">
			{nav.map((item, index) => {
				const isActive = checkIfActive({
					pathname: pathname,
					url: item.url,
				});

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

const FrenchDots = () => {
	const dotVariants = {
		animate: (i) => ({
			y: [0, -4, 0],
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
					animate="animate"
				/>
			))}
		</div>
	);
};

const DesignDots = () => {
	const dotVariants = {
		animate: (i) => ({
			scale: [1, 0.5, 1],
			transition: {
				duration: 1.2,
				repeat: Infinity,
				ease: 'easeInOut',
				delay: i * 0.2,
			},
		}),
	};

	return (
		<div className="g-header__design">
			{[0, 1, 2].map((i) => (
				<motion.div
					key={i}
					className="g-header__design-dot"
					custom={i}
					variants={dotVariants}
					animate="animate"
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
	const [isTransparent, setIsTransparent] = useState(false);

	useEffect(() => {
		if (!ref?.current) return;

		const updateHeaderProperties = () => {
			const height = ref.current.offsetHeight;
			document.documentElement.style.setProperty('--s-header', `${height}px`);
			document.documentElement.style.setProperty(
				'--s-header-space',
				`calc(${height}px + var(--s-contain))`
			);
		};

		// Initial update
		updateHeaderProperties();

		// Create observer to handle dynamic height changes
		const resizeObserver = new ResizeObserver(updateHeaderProperties);
		resizeObserver.observe(ref.current);

		return () => {
			resizeObserver.disconnect();
		};
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
		const pathnameArray = pathname.split('/').filter(Boolean);

		setIsMobileMenuOpen(false);

		const isNonCategoryPage =
			pathnameArray[2] !== 'category' &&
			(pathname.includes('/paris/itinerary/') ||
				pathname.includes('/paris/guides/'));

		setIsTransparent(isNonCategoryPage);
	}, [pathname]);

	return (
		<>
			<header
				ref={ref}
				className={clsx('g-header', 'user-select-disable', {
					'is-scrolled': isScrolled,
					'is-transparent': isTransparent,
					'is-active': isActive,
					'is-mobile-open': isMobileMenuOpen,
				})}
			>
				<Link href={'/'} className="g-header__logo t-h-3">
					SPOTS
				</Link>
				<div className="g-header__menu">
					<div className="g-header__menu__block">
						<div className="g-header__menu__translate">
							<motion.div className="g-header__tagline t-h-5">
								Parisian Treasures Refreshed Weekly
								<FrenchDots />
							</motion.div>
							<NavLink nav={leftNav} pathname={pathname} />
						</div>
					</div>
					<div className="g-header__menu__block">
						<div className="g-header__menu__translate">
							<motion.div className="g-header__tagline t-h-5">
								Design Conscious Travel Planning
								<DesignDots />
							</motion.div>
							<NavLink nav={rightNav} pathname={pathname} />
						</div>
					</div>
				</div>
				<div className="g-header__cta">
					<Button className="btn-underline" href={'/contact'}>
						Contact & FAQ
					</Button>
				</div>
				<MobileMenuTrigger
					isMobileMenuOpen={isMobileMenuOpen}
					onHandleClick={onToggleMenu}
				/>
			</header>
		</>
	);
}
