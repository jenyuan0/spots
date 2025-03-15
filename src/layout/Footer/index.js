import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { pageTransitionFade } from '@/lib/animate';
import Menu from '@/components/Menu';

export default function Footer({ siteData, data, isActive }) {
	const footerRef = useRef();

	useEffect(() => {
		document.documentElement.style.setProperty(
			'--s-footer',
			`${footerRef?.current?.offsetHeight || 0}px`
		);
	}, []);

	return (
		<>
			<motion.footer
				ref={footerRef}
				initial="initial"
				animate="animate"
				variants={pageTransitionFade}
				className={clsx('g-footer cr-white bg-black', {
					'is-active': isActive,
				})}
			>
				<div className="g-footer__main">
					{data?.menu?.items && (
						<Menu
							items={data.menu.items}
							className="g-footer__links"
							ulClassName="f-h f-a-c f-j-s t-b-2 user-select-disable"
						/>
					)}
				</div>
				<div className="g-footer__sub f-h f-a-c">
					<div className="g-footer__copyright">
						© {new Date().getFullYear()} {siteData?.title}
					</div>

					{data?.menuLegal?.items && (
						<Menu
							items={data.menuLegal.items}
							className="g-footer__legal"
							ulClassName="f-h f-a-c t-b-2 user-select-disable"
						/>
					)}
				</div>
			</motion.footer>
		</>
	);
}
