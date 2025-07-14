import React, { useEffect, useState, useRef } from 'react';
import clsx from 'clsx';
import { scrollEnable, scrollDisable } from '@/lib/helpers';
import Link from '@/components/CustomLink';
import MobileMenuTrigger from './mobile-menu-trigger';
import Button from '@/components/Button';
import useSearchHotel from '@/hooks/useSearchHotel';
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
	const { setSearchHotelActive } = useSearchHotel();

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

	useEffect(() => {
		if (typeof window === 'undefined') return;

		const params = new URLSearchParams(window.location.search);
		const shouldTrigger = params.get('s') === 'true';

		if (shouldTrigger) {
			setSearchHotelActive(true);

			const cleanUrl = window.location.pathname;
			window.history.replaceState({}, '', cleanUrl);
		}
	}, []);

	console.log(pathname);

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
					aria-label="View homepage"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 342.25 134.12">
						<path
							fill="currentColor"
							d="M95.57 37.5c-11.39 0-15.01-4.72-15.18-9.5-.11-3.09 1.82-5.96 4.3-7.68s5.45-2.48 8.37-3.11c.68-.15 1.62-.14 1.79.56.19.78-.81 1.22-1.55 1.44-2.75.83-4.93 3.44-5.33 6.38s2.05 6.26 6.31 6.26c5.7 0 9.26-3.42 9.26-10.57 0-9.58-6.63-16.3-17.5-16.3S59.95 11 59.95 29.22c0 23.48 35.93 27.6 35.93 52.9s-22.17 43.46-57.46 43.46S-.17 105.35 0 98.03c.38-15.21 14.59-24.15 27.64-24.97 7.75-.49 21.73 3.48 21.73 13.3 0 6.14-2.63 11.14-14.24 11.77-.28.02-.55-.02-.82-.07-.49-.08-1-.75-.96-1.23.02-.28.51-.66.94-.73 8.38-1.34 5.11-18.31-6.7-18.31s-15.71 8.53-15.71 18.2c0 17.81 16.47 23.54 31.9 23.54 23.64 0 38.73-12.07 38.73-28.44 0-26.67-31.53-27.57-31.53-54.97S77.04 0 86.95 0c17.84 0 26.53 10.91 26.53 19.61 0 12.43-10.04 17.88-17.91 17.88Zm6.97 96.62c-1.09 0-1.91-.27-2.45-.82-.55-.55-.82-1.22-.82-2.01 0-.75.21-1.4.63-1.92.42-.52.94-.79 1.58-.79.71 0 1.66.15 2.83.44 1.18.29 2.12.44 2.83.44 3.11 0 4.66-2.39 4.66-7.18v-70.7c0-3.02-.86-4.53-2.58-4.53-1.05 0-2.45.47-4.22 1.42-1.76.95-2.85 1.42-3.27 1.42-.67 0-1.25-.34-1.73-1.01-.48-.67-.72-1.41-.72-2.21 0-1.14.44-1.82 1.32-2.08 6.51-2.31 12.04-5.35 16.62-9.13.67-.55 1.45-.82 2.33-.82 1.85 0 2.71.86 2.58 2.58l-.63 8.94c6.51-7.68 13.98-11.52 22.41-11.52 5.58 0 10.49 1.48 14.73 4.44 4.24 2.96 7.46 6.95 9.67 11.99s3.31 10.7 3.31 17c0 5.5-.79 10.66-2.36 15.48-1.58 4.82-3.82 9.07-6.74 12.72-2.92 3.65-6.58 6.52-10.98 8.62-4.41 2.1-9.28 3.15-14.61 3.15-5.88 0-10.89-1.13-15.04-3.4v17.64c0 4.78 1.55 7.18 4.66 7.18.96 0 2.31-.15 4.03-.44 1.72-.29 3.12-.44 4.22-.44.63 0 1.14.26 1.54.79.4.52.6 1.16.6 1.92 0 .79-.26 1.47-.79 2.01-.52.55-1.33.82-2.42.82-.75 0-2.96-.08-6.61-.25-3.65-.17-6.65-.25-9-.25s-5.34.08-8.97.25c-3.63.16-5.82.25-6.58.25h-.02Zm19.32-48.68c0 5.33 1.65 9.48 4.94 12.47 3.29 2.98 7.31 4.47 12.05 4.47 6.59 0 11.89-2.83 15.9-8.5s6.01-13.37 6.01-23.1-1.89-16.46-5.67-21.18c-3.78-4.72-8.75-7.08-14.92-7.08-6.88 0-12.99 2.85-18.32 8.56v34.37Zm88.94 22.6c-9.48 0-17.25-3.36-23.29-10.07-6.04-6.71-9.07-15.44-9.07-26.19 0-5.67.88-10.86 2.64-15.58 1.76-4.72 4.16-8.64 7.21-11.74 3.04-3.11 6.6-5.52 10.67-7.24 4.07-1.72 8.41-2.58 13.03-2.58 9.48 0 17.25 3.36 23.29 10.07 6.04 6.71 9.07 15.44 9.07 26.18 0 5.67-.88 10.86-2.64 15.58-1.76 4.72-4.17 8.64-7.21 11.74-3.04 3.11-6.6 5.52-10.67 7.24-4.07 1.72-8.41 2.58-13.03 2.58Zm-21.91-39.47c0 3.52.32 6.91.94 10.17.63 3.25 1.61 6.31 2.93 9.16 1.32 2.85 2.92 5.33 4.78 7.43 1.86 2.1 4.12 3.75 6.76 4.97 2.64 1.22 5.54 1.82 8.69 1.82 4.53 0 8.41-1.26 11.61-3.78 3.21-2.52 5.56-5.84 7.05-9.98 1.49-4.14 2.24-8.88 2.24-14.26 0-4.41-.51-8.59-1.54-12.56-1.03-3.97-2.51-7.52-4.43-10.67-1.93-3.15-4.46-5.64-7.58-7.49-3.13-1.85-6.64-2.77-10.54-2.77-4.53 0-8.41 1.25-11.61 3.75-3.21 2.5-5.56 5.81-7.05 9.95-1.49 4.14-2.24 8.89-2.24 14.26Zm82.09 39.47c-4.41 0-7.92-1.4-10.54-4.19-2.62-2.79-3.93-7.04-3.93-12.75V42.5h-12.47c-1.14 0-1.7-.63-1.7-1.89s.56-1.95 1.7-1.95c4.19 0 8.01-1.71 11.42-5.13 3.42-3.42 5.32-7.78 5.69-13.06.12-1.64 1.03-2.45 2.71-2.45.75 0 1.39.2 1.92.6.52.4.79.98.79 1.73v15.99l20.9-.51c1.81 0 2.71 1.15 2.71 3.47 0 1.09-.22 2.01-.66 2.74-.44.74-1.08 1.08-1.92 1.04-10.49-.38-17.5-.56-21.03-.56v47.59c0 6.71 2.45 10.07 7.37 10.07 4.24 0 8.18-3.44 11.84-10.32.55-1.14 1.32-1.7 2.33-1.7.92 0 1.65.23 2.17.69.52.46.79 1.09.79 1.89 0 .67-.17 1.28-.51 1.82-1.05 1.81-2.01 3.38-2.87 4.72-.86 1.34-1.92 2.73-3.18 4.15-1.26 1.43-2.52 2.59-3.78 3.49-1.26.91-2.73 1.65-4.41 2.24-1.68.59-3.46.88-5.35.88Zm46.64 0c-1.09 0-2.17-.04-3.24-.12-1.07-.08-2.18-.25-3.34-.51-1.15-.25-2.09-.45-2.8-.6-.71-.15-1.71-.43-2.99-.85-1.28-.42-2.12-.69-2.52-.82-.4-.12-1.31-.46-2.73-1.01-1.43-.55-2.22-.84-2.4-.88-1.51-.55-2.26-1.78-2.26-3.71 0-.55.04-1.28.12-2.21.08-.92.12-1.62.12-2.08 0-1.93-.24-4.14-.72-6.64-.48-2.49-.72-3.81-.72-3.94 0-.63.34-1.15 1.01-1.57.67-.42 1.41-.63 2.21-.63.84 0 1.48.17 1.92.51.44.34.75.94.91 1.82 1.26 5.79 3.64 10.23 7.15 13.31 3.51 3.08 7.62 4.62 12.37 4.62 4.36 0 7.78-1.19 10.23-3.59 2.45-2.39 3.68-5.25 3.68-8.56 0-2.89-.95-5.53-2.84-7.9s-4.68-4.21-8.37-5.51l-10.7-3.71c-4.95-1.72-9.01-4.14-12.18-7.27-3.17-3.12-4.75-6.94-4.75-11.42 0-6.04 2.27-10.91 6.8-14.61 4.53-3.69 10.1-5.54 16.68-5.54 2.05 0 4.98.32 8.78.98 3.8.65 6.36.98 7.71.98 1.22 0 2.07.24 2.55.72s.72 1.31.72 2.49v1.32c0 2.14.21 4.28.63 6.42.42 2.14.84 3.89 1.26 5.25.42 1.36.63 2.15.63 2.36 0 .46-.31.88-.94 1.26-.63.38-1.3.56-2.01.56-1.05 0-1.81-.52-2.27-1.57-4.62-10.32-10.81-15.48-18.57-15.48-3.73 0-6.84 1.03-9.32 3.08-2.48 2.06-3.71 4.95-3.71 8.69 0 5.25 3.69 9.19 11.08 11.84l10.58 3.78c5.54 1.93 9.74 4.67 12.59 8.21 2.85 3.55 4.28 7.63 4.28 12.24 0 5.62-2.17 10.41-6.52 14.35-4.34 3.95-10.38 5.92-18.1 5.92h-.01Z"
						/>
					</svg>
				</Link>

				{pathname === '/' || pathname === '/travel-design' ? (
					<div className="g-header__toggle t-l-2">
						<Link
							href="/"
							className={clsx({
								'is-active': pathname === '/',
							})}
						>
							Hotel Booking
						</Link>
						<Link
							href="/travel-design"
							className={clsx({
								'is-active': pathname === '/travel-design',
							})}
						>
							Travel Design
						</Link>
					</div>
				) : (
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
				)}
				<div className="g-header__cta">
					{pathname === '/' && (
						<Button
							className="btn-underline js-gtm-search"
							onClick={() => setSearchHotelActive(true)}
						>
							Search Hotel
						</Button>
					)}
					{pathname === '/travel-design' && (
						<Button
							className="btn-underline js-gtm-plan"
							onClick={() => setSearchHotelActive(true)}
						>
							Plan Your Trip
						</Button>
					)}
					{pathname !== '/' && pathname !== '/travel-design' && (
						<Button className="btn-underline" href={'/contact'}>
							Contact & FAQ
						</Button>
					)}
				</div>
				{pathname !== '/' && pathname !== '/travel-design' && (
					<MobileMenuTrigger
						isMobileMenuOpen={isMobileMenuOpen}
						onHandleClick={onToggleMenu}
					/>
				)}
			</header>
		</>
	);
}
