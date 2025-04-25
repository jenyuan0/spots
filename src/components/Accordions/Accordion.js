import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';

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
	isCaret,
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
				{subtitle && <div className="c-accordion__subtitle">{subtitle}</div>}
				<div className="c-accordion__title">{title}</div>
				<div className="c-accordion__icon">
					{isCaret ? (
						<div className="icon-caret-down" />
					) : (
						<div className="icon-plus" />
					)}
				</div>
			</button>
			<motion.div
				className="c-accordion__content"
				initial={isExpanded ? 'collapsed' : 'expanded'}
				animate={isExpanded ? 'expanded' : 'collapsed'}
				transition={{ duration: 0.3, ease: [0, 0.55, 0.45, 1] }}
				variants={accordionAnim}
				aria-hidden={!isExpanded}
			>
				<div className="c-accordion__inner">{children}</div>
			</motion.div>
		</div>
	);
}
