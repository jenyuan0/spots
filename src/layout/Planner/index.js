import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import PlannerForm from '@/components/PlannerForm';
import usePlanner from '@/hooks/usePlanner';
import useKey from '@/hooks/useKey';
import useWindowDimensions from '@/hooks/useWindowDimensions';
import { scrollEnable, scrollDisable } from '@/lib/helpers';

export default function Planner() {
	const ref = useRef();
	const refContent = useRef();
	const {
		plannerActive,
		clearPlannerContent,
		plannerContent,
		setPlannerActive,
	} = usePlanner();
	const { height } = useWindowDimensions();
	const [isFullScreen, setIsFullScreen] = useState(false);

	useEffect(() => {
		setIsFullScreen(refContent.current.clientHeight > height - 20);
	}, [ref, height, refContent, plannerActive]);

	useEffect(() => {
		plannerActive == true ? scrollDisable(refContent.current) : scrollEnable();
	}, [plannerActive]);

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
			ref={ref}
			className={clsx('g-planner cr-white', {
				'is-active': plannerActive,
				'is-fullscreen': isFullScreen,
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
			<div ref={refContent} className="g-planner__content">
				<button className="g-planner__close trigger" onClick={handleClose}>
					<div className="icon-close" />
				</button>
				<PlannerForm data={plannerContent} />
			</div>
		</div>
	);
}
