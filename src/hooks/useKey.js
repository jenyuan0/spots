import { useState, useEffect } from 'react';

export default function useKey(onEscape) {
	const [pressedKeys, setPressedKeys] = useState({
		command: false, // For Mac
		ctrl: false, // For Windows/Linux
		shift: false,
		alt: false, // Alt/Option
	});
	const [hasPressedKeys, setHasPressedKeys] = useState(false);

	useEffect(() => {
		const handleKeyDown = (e) => {
			const newPressedKeys = {
				command: e.metaKey,
				ctrl: e.ctrlKey,
				shift: e.shiftKey,
				alt: e.altKey,
			};
			setPressedKeys(newPressedKeys);
			setHasPressedKeys(Object.values(newPressedKeys).includes(true));
		};

		const handleKeyUp = (e) => {
			const newPressedKeys = {
				command: e.metaKey,
				ctrl: e.ctrlKey,
				shift: e.shiftKey,
				alt: e.altKey,
			};
			setPressedKeys(newPressedKeys);
			setHasPressedKeys(Object.values(newPressedKeys).includes(true));

			// Call onEscape callback when Escape key is released
			if (e.key === 'Escape' && onEscape) {
				onEscape();
			}
		};

		const handleVisibilityChange = () => {
			// Reset keys when tab/window loses focus
			if (document.hidden) {
				setPressedKeys({
					command: false,
					ctrl: false,
					shift: false,
					alt: false,
				});
				setHasPressedKeys(false);
			} else {
				// Recheck key states when focus returns
				setPressedKeys({
					command: false,
					ctrl: false,
					shift: false,
					alt: false,
				});
				setHasPressedKeys(false);
			}
		};

		const handleBlur = () => {
			// Reset keys when window loses focus
			setPressedKeys({
				command: false,
				ctrl: false,
				shift: false,
				alt: false,
			});
			setHasPressedKeys(false);
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		document.addEventListener('visibilitychange', handleVisibilityChange);
		window.addEventListener('blur', handleBlur);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			window.removeEventListener('blur', handleBlur);
		};
	}, [onEscape]);

	return {
		pressedKeys,
		hasPressedKeys,
	};
}
