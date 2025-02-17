import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useEffect, useState, useRef } from 'react';

const accordionAnim = {
	collapsed: {
		opacity: 0,
		height: 0,
	},
	expanded: {
		opacity: 1,
		height: 'auto',
	},
};

export default function Accordion({
	isActive = false,
	title,
	subtitle,
	className,
	onHandleToggle,
	children,
	...props
}) {
	const [isExpanded, setIsExpanded] = useState(false);

	const handleToggle = () => {
		if (onHandleToggle) {
			onHandleToggle();
		} else {
			setIsExpanded(!isExpanded);
		}
	};

	useEffect(() => {
		setIsExpanded(isActive);
	}, [isActive]);

	return (
		<div
			className={clsx('c-accordion', className, {
				'is-active': isExpanded,
			})}
			{...props}
		>
			<button
				type="button"
				aria-expanded={isExpanded}
				aria-label="Toggle accordion"
				className="c-accordion__toggle f-h f-a-c user-select-disable"
				onClick={handleToggle}
			>
				<div className="c-accordion__subtitle">{subtitle}</div>
				<div className="c-accordion__title">{title}</div>
				<div className="c-accordion__icon">
					<div className="icon-caret-down" />
				</div>
			</button>
			<AnimatePresence>
				{isExpanded && (
					<motion.div
						className="c-accordion__content"
						initial="collapsed"
						animate="expanded"
						exit="collapsed"
						transition={{ duration: 0.4, ease: [0, 1, 0.8, 1] }}
						variants={accordionAnim}
						aria-hidden={!isExpanded}
					>
						<div className="c-accordion__inner">{children}</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
