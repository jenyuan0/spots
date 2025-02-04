import { useEffect } from 'react';

let tabindexCache = new WeakMap(); // Shared across all hook instances

export const focusableSelectors = [
	'a[href]',
	'input:not([disabled])',
	'textarea:not([disabled])',
	'select:not([disabled])',
	'button:not([disabled])',
	'iframe',
	'details',
	'[contenteditable]',
	'[tabindex]:not([disabled])',
];

export default function useAriaFocusManager(
	containerRef,
	dependencies = [],
	tabindex = 0
) {
	const updateFocusableElements = () => {
		if (!containerRef.current) return;

		const isHidden =
			containerRef.current.getAttribute('aria-hidden') === 'true';
		const focusableChildren = containerRef.current.querySelectorAll(
			focusableSelectors.join(', ')
		);

		focusableChildren.forEach((child) => {
			// Cache the original tabindex value if not already cached
			if (!tabindexCache.has(child)) {
				tabindexCache.set(child, child.getAttribute('tabindex'));
			}

			if (isHidden) {
				// Set tabindex to -1 if hidden
				child.setAttribute('tabindex', -1);
			} else {
				// Restore original tabindex value or set to 0
				const originalTabindex = tabindexCache.get(child);
				child.setAttribute('tabindex', originalTabindex || tabindex);
			}
		});
	};

	useEffect(() => {
		if (!containerRef.current) return;

		const observer = new MutationObserver((mutationsList) => {
			mutationsList.forEach((mutation) => {
				if (
					mutation.type === 'attributes' &&
					mutation.attributeName === 'aria-hidden'
				) {
					updateFocusableElements();
				}
			});
		});

		observer.observe(containerRef.current, {
			attributes: true,
			attributeFilter: ['aria-hidden'],
		});

		// Initial update
		updateFocusableElements();

		// Cleanup observer on unmount
		return () => {
			observer.disconnect();
		};
	}, [containerRef, ...dependencies]);

	return null;
}
