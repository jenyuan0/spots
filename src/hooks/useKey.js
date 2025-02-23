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
				escape: e.key === 'Escape',
			};
			setPressedKeys(newPressedKeys);
			setHasPressedKeys(Object.values(newPressedKeys).includes(true));

			// Call onEscape callback when Escape key is released
			if (e.key === 'Escape' && onEscape) {
				onEscape();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [onEscape]);

	return {
		pressedKeys,
		hasPressedKeys,
	};
}
