import { useEffect, useRef, useState } from 'react';

export default function useKey(onEscape) {
	const [pressedKeys, setPressedKeys] = useState({
		command: false, // For Mac
		ctrl: false, // For Windows/Linux
		shift: false,
		alt: false, // Alt/Option
	});
	const [hasPressedKeys, setHasPressedKeys] = useState(false);

	// Keep a stable ref to the latest onEscape callback
	const onEscapeRef = useRef(onEscape);
	useEffect(() => {
		onEscapeRef.current = onEscape;
	}, [onEscape]);

	useEffect(() => {
		const areEqual = (a, b) =>
			a.command === b.command &&
			a.ctrl === b.ctrl &&
			a.shift === b.shift &&
			a.alt === b.alt;

		const updateStateIfChanged = (next) => {
			setPressedKeys((prev) => (areEqual(prev, next) ? prev : next));
			const nextHas = next.command || next.ctrl || next.shift || next.alt;
			setHasPressedKeys((prev) => (prev === nextHas ? prev : nextHas));
		};

		const handleKeyDown = (e) => {
			const next = {
				command: e.metaKey,
				ctrl: e.ctrlKey,
				shift: e.shiftKey,
				alt: e.altKey,
			};
			updateStateIfChanged(next);
		};

		const handleKeyUp = (e) => {
			const next = {
				command: e.metaKey,
				ctrl: e.ctrlKey,
				shift: e.shiftKey,
				alt: e.altKey,
			};
			updateStateIfChanged(next);

			if (e.key === 'Escape' && typeof onEscapeRef.current === 'function') {
				onEscapeRef.current();
			}
		};

		const resetKeys = () => {
			updateStateIfChanged({
				command: false,
				ctrl: false,
				shift: false,
				alt: false,
			});
		};

		const handleVisibilityChange = () => {
			if (document.hidden) {
				resetKeys();
			}
		};

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);
		document.addEventListener('visibilitychange', handleVisibilityChange);
		window.addEventListener('blur', resetKeys);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			document.removeEventListener('visibilitychange', handleVisibilityChange);
			window.removeEventListener('blur', resetKeys);
		};
	}, []); // Attach listeners once

	return {
		pressedKeys,
		hasPressedKeys,
	};
}
