import { useEffect } from 'react';

export default function useEscKey(callBackFunc) {
	useEffect(() => {
		const handleEscape = (event) => {
			if (event.key === 'Escape') {
				callBackFunc();
			}
		};

		document.addEventListener('keydown', handleEscape);
		return () => document.removeEventListener('keydown', handleEscape);
	}, [callBackFunc]);
}
