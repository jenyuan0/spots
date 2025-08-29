import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';
import React from 'react';
import clsx from 'clsx';
import { pageTransitionFade } from '@/lib/animate';
import useAsideMap from '@/hooks/useAsideMap';

export default function Main({ children }) {
	const pathname = usePathname();

	return (
		<motion.main
			id="main"
			key={pathname}
			initial="initial"
			animate="animate"
			variants={pageTransitionFade}
		>
			{children}
		</motion.main>
	);
}
