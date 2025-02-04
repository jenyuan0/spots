import { useEffect, useRef } from 'react';
import { focusableSelectors } from '@/hooks/useAriaFocusManager';

export default function useAriaFocusNavigation(containerRef, isActive, onExit) {
	// Ref to store the element that was focused before the modal opens
	const lastFocusedElementRef = useRef(null);

	useEffect(() => {
		if (isActive) {
			// save the currently focused element before opening the modal
			lastFocusedElementRef.current = document.activeElement;

			const containerElement = containerRef.current;
			if (!containerElement) return;

			const focusableElements = containerElement.querySelectorAll(
				focusableSelectors.join(', ')
			);
			if (focusableElements.length === 0) return;

			const firstElement = focusableElements[0];
			const lastElement = focusableElements[focusableElements.length - 1];

			const handleTabKeyPress = (event) => {
				if (event.key === 'Tab') {
					if (event.shiftKey && document.activeElement === firstElement) {
						event.preventDefault();
						lastElement.focus();
					} else if (
						!event.shiftKey &&
						document.activeElement === lastElement
					) {
						event.preventDefault();
						firstElement.focus();
					}
				}
			};

			firstElement.focus();

			containerElement.addEventListener('keydown', handleTabKeyPress);

			return () =>
				containerElement.removeEventListener('keydown', handleTabKeyPress);
		} else {
			// restore focus to the last focused element if the component becomes inactive
			if (lastFocusedElementRef.current) {
				lastFocusedElementRef.current.focus();
			}

			// optionally call onExit if provided
			if (onExit) onExit();
		}
	}, [containerRef, isActive, onExit]);
}
