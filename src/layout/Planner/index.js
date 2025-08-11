import React, { useEffect } from 'react';
import clsx from 'clsx';
import PlannerForm from '@/components/PlannerForm';
import { usePathname } from 'next/navigation';
import usePlanner from '@/hooks/usePlanner';
import useKey from '@/hooks/useKey';

export default function Planner() {
	const pathname = usePathname();
	const {
		plannerActive,
		clearPlannerContent,
		plannerContent,
		setPlannerActive,
	} = usePlanner();

	useEffect(() => {
		if (typeof window === 'undefined') return;

		const params = new URLSearchParams(window.location.search);
		const shouldTrigger = params.get('s') === 'true';

		if (shouldTrigger) {
			setPlannerActive(true);

			const cleanUrl = window.location.pathname;
			window.history.replaceState({}, '', cleanUrl);
		}
	}, []);

	const handleClose = () => {
		setPlannerActive(false);
		// Remove ?s=true from the URL
		const url = new URL(window.location.href);
		url.searchParams.delete('s');
		window.history.replaceState({}, '', url.toString());
		setTimeout(() => {
			clearPlannerContent();
		}, 500);
	};

	useKey(handleClose);

	return (
		<div
			className={clsx('g-planner cr-white', {
				'is-active': plannerActive,
			})}
			role="dialog"
			aria-label="Plan trip"
			aria-modal={plannerActive}
		>
			<button
				className="g-planner__overlay"
				aria-hidden="true"
				onClick={handleClose}
			/>
			<div className="g-planner__content">
				<button className="g-planner__close trigger" onClick={handleClose}>
					<div className="icon-close" />
				</button>
				<PlannerForm data={plannerContent} />
			</div>
		</div>
	);
}
