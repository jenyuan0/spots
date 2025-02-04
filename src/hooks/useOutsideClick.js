import { useEffect } from 'react';

export default function useOutsideClick(ref, callBackFunc) {
	useEffect(() => {
		function handleClickOutside(e) {
			const refs = Array.isArray(ref) ? ref : [ref];
			const refsClicked = refs.filter((el) => {
				return el?.current && el?.current.contains(e.target);
			});

			if (refsClicked.length == 0) {
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
