import { useEffect } from 'react';

export default function useOutsideClick(ref, callBackFunc, excludeClass) {
	useEffect(() => {
		function handleClickOutside(e) {
			const classes =
				typeof excludeClass === 'string' ? [excludeClass] : excludeClass;

			if (classes?.some((cls) => e.target.closest(`.${cls}`))) {
				return;
			}

			const refs = Array.isArray(ref) ? ref : [ref];
			const isOutside = refs.every(
				(r) => r.current && !r.current.contains(e.target)
			);

			if (isOutside) {
				callBackFunc();
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('touchstart', handleClickOutside);

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('touchstart', handleClickOutside);
		};
	}, [ref, callBackFunc]);
}
