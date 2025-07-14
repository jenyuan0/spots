import React, { useEffect, useRef } from 'react';
import Link from '@/components/CustomLink';
import { motion } from 'framer-motion';
import { pageTransitionFade } from '@/lib/animate';
import { usePathname } from 'next/navigation';

export default function Footer({ siteData, data, isActive }) {
	const pathname = usePathname();
	const footerRef = useRef();

	useEffect(() => {
		document.documentElement.style.setProperty(
			'--s-footer',
			`${footerRef?.current?.offsetHeight || 0}px`
		);
	}, []);

	const nav = [
		{
			title: 'Explore Paris',
			url: '/paris',
		},
		{
			title: 'Guides',
			url: '/paris/guides',
		},
		{
			title: 'Locations',
			url: '/paris/locations',
		},
		{
			title: 'Service Overview',
			url: '/',
		},
		{
			title: 'Ready-to-book Trips',
			url: '/paris/ready-to-book-trips',
		},
		{
			title: 'Contact & FAQ',
			url: '/contact',
		},
	];

	return (
		<>
			<motion.footer
				ref={footerRef}
				initial="initial"
				animate="animate"
				variants={pageTransitionFade}
				className={'g-footer'}
			>
				<div className="g-footer__copyright t-h-5">
					© {new Date().getFullYear()} {siteData?.title}
				</div>
				{pathname !== '/' && pathname !== '/travel-design' && (
					<ul className="g-footer__links t-l-2">
						{nav.map((item, index) => {
							return (
								<li key={`${item.title}-${index}`}>
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
				)}
			</motion.footer>
		</>
	);
}
