import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import React from 'react';
import clsx from 'clsx';
import { pageTransitionFade } from '@/lib/animate';
import useAsideMap from '@/hooks/useAsideMap';

export default function Main({ children, isSpaceL, isSpaceR }) {
	const pathname = usePathname();
	const { asideMapExpand } = useAsideMap();

	return (
		<motion.main
			id="main"
			className={clsx({
				'is-space-l': isSpaceL,
				'is-space-r': isSpaceR,
				'is-aside-map-expand': asideMapExpand,
			})}
			key={pathname}
			initial="initial"
			animate="animate"
			variants={pageTransitionFade}
		>
			{children}
		</motion.main>
	);
}
