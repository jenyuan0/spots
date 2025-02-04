import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import React from 'react';

import { pageTransitionFade } from '@/lib/animate';

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
