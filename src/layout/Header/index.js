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

		handleScroll();
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
				<Link
					href={'/'}
					className="g-header__logo t-h-3"
					aria-label="Go to homepage"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36.64 9.39">
						<path
							fill="currentColor"
							d="M.48,8.78c-.25-.1-.32-.34-.28-.68.05-.4-.02-.65-.18-1.31-.02-.08-.02-.12-.02-.14,0-.2.19-.34.38-.34.17,0,.32.1.36.32.23,1.57,1.31,2.24,2.36,2.24,1.3,0,1.93-.79,1.93-1.7s-.53-1.48-1.58-1.88l-1.09-.42C1.26,4.45.3,3.74.3,2.41.3.96,1.49.04,3.09.04c.78,0,1.52.24,2.09.24.35,0,.44.13.41.5-.05.54.11,1.01.3,1.51.02.06.02.08.02.11,0,.17-.19.29-.36.29-.12,0-.22-.05-.25-.18-.3-1.33-1.19-1.96-2.23-1.96s-1.83.5-1.83,1.61c0,1.01.86,1.49,1.52,1.75l1.12.46c1.45.59,2.16,1.21,2.16,2.4,0,1.37-1.01,2.63-2.91,2.63-1.18,0-1.91-.35-2.64-.61ZM6.32,8.94c0-.16.11-.3.32-.3.16,0,.32.13.59.13.34,0,.43-.19.43-.79V1.45c0-.61-.1-.8-.43-.8-.26,0-.43.13-.59.13-.22,0-.32-.14-.32-.3s.13-.32.36-.32c.46,0,.82.08,1.58.07l1.75-.02c1.94-.02,3.25.79,3.25,2.42s-1.39,2.61-2.89,2.61c-.31,0-.68-.06-1.01-.16-.14-.05-.19-.14-.19-.25,0-.14.08-.28.24-.28.17,0,.41.16.86.16,1.06,0,1.96-.74,1.96-2.06s-.95-1.92-2.24-1.92h-.67c-.47,0-.6.13-.6.6v6.64c0,.6.1.79.43.79.26,0,.43-.13.6-.13.2,0,.31.14.31.29,0,.17-.12.34-.36.34-.46,0-.96-.07-1.51-.07-.6,0-1.06.07-1.51.07-.23,0-.36-.17-.36-.32ZM13.46,4.81C13.46,1.85,15.59.04,18.23.04s4.58,1.82,4.58,4.59c0,2.95-2.1,4.76-4.75,4.76s-4.59-1.82-4.59-4.58ZM21.67,4.85c0-2.4-1.42-4.28-3.66-4.28-2.12,0-3.41,1.84-3.41,4.02,0,2.37,1.39,4.29,3.66,4.29,2.12,0,3.41-1.85,3.41-4.03ZM24.79,8.94c0-.16.11-.3.32-.3.16,0,.32.13.59.13.34,0,.43-.19.43-.79V1.67c0-.84-.13-.94-.94-.94h-.52c-.86,0-1.04.28-1.38,1-.1.2-.14.31-.18.48-.02.1-.11.14-.22.14-.16,0-.34-.1-.34-.25,0-.14.37-.71.47-1.63.02-.2.01-.47.25-.47.08,0,.16.06.24.1.1.05.25.1.64.1.9,0,1.73.02,2.48.02s1.61-.02,2.51-.02c.38,0,.54-.05.64-.1.08-.04.16-.1.24-.1.24,0,.23.26.25.47.1.92.47,1.49.47,1.63,0,.16-.18.25-.34.25-.11,0-.19-.05-.22-.14-.04-.17-.08-.28-.18-.48-.34-.72-.52-1-1.38-1h-.52c-.8,0-.94.1-.94.94v6.31c0,.6.1.79.43.79.26,0,.43-.13.6-.13.2,0,.31.14.31.29,0,.17-.12.34-.36.34-.46,0-.96-.07-1.51-.07-.6,0-1.06.07-1.51.07-.23,0-.36-.17-.36-.32ZM31.09,8.78c-.25-.1-.32-.34-.28-.68.05-.4-.02-.65-.18-1.31-.02-.08-.02-.12-.02-.14,0-.2.19-.34.38-.34.17,0,.32.1.36.32.23,1.57,1.31,2.24,2.36,2.24,1.3,0,1.93-.79,1.93-1.7s-.53-1.48-1.58-1.88l-1.09-.42c-1.1-.42-2.06-1.13-2.06-2.46,0-1.45,1.19-2.37,2.79-2.37.78,0,1.52.24,2.09.24.35,0,.44.13.41.5-.05.54.11,1.01.3,1.51.02.06.02.08.02.11,0,.17-.19.29-.36.29-.12,0-.22-.05-.25-.18-.3-1.33-1.19-1.96-2.23-1.96s-1.83.5-1.83,1.61c0,1.01.86,1.49,1.52,1.75l1.12.46c1.45.59,2.16,1.21,2.16,2.4,0,1.37-1.01,2.63-2.91,2.63-1.18,0-1.91-.35-2.64-.61Z"
						/>
					</svg>
				</Link>
				<div className="g-header__menu">
					<div className="g-header__menu__block">
						<div className="g-header__menu__translate">
							<motion.div className="g-header__tagline t-h-5">
								<span className="icon-plus" />
								Parisian Treasures Refreshed Weekly
								<FrenchDots />
							</motion.div>
							<NavLink nav={leftNav} pathname={pathname} />
						</div>
					</div>
					<div className="g-header__menu__block">
						<div className="g-header__menu__translate">
							<motion.div className="g-header__tagline t-h-5">
								<span className="icon-plus" />
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
