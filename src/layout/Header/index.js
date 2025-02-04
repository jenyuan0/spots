import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { scrollEnable, scrollDisable } from '@/lib/helpers';
import Link from 'next/link';
import Menu from '@/components/Menu';
import MobileMenuTrigger from './mobile-menu-trigger';

export default function Header({ siteData, data }) {
	const pathname = usePathname();
	const headerRef = useRef();
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		document.documentElement.style.setProperty(
			'--s-header',
			`${headerRef?.current?.offsetHeight || 0}px`
		);
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
				ref={headerRef}
				className={clsx('g-header f-h no-text-space', {
					'is-open': isMobileMenuOpen,
				})}
			>
				<Link className="g-header__logo" href="/">
					<span className="t-b-1">{siteData?.title ?? 'Title'}</span>
				</Link>

				{data?.menu?.items && (
					<Menu
						items={data.menu.items}
						className="g-header__links user-select-disable mobile-up-only"
						ulClassName="f-h f-a-c t-b-2 user-select-disable"
					/>
				)}
				<MobileMenuTrigger
					isMobileMenuOpen={isMobileMenuOpen}
					onHandleClick={onToggleMenu}
				/>
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
				{data?.menu && (
					<Menu
						items={data?.menu?.items}
						className="g-mobile-menu__links"
						ulClassName="f-v f-j-s f-a-c t-h-3"
					/>
				)}
			</div>
		</>
	);
}
