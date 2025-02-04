export const pageTransitionFade = {
	initial: {
		opacity: 0,
	},
	animate: {
		opacity: 1,
		transition: { duration: 0.4, delay: 0.6 },
	},
	exit: {
		opacity: 0,
		transition: { duration: 0.4 },
	},
};

export const fadeAnim = {
	show: {
		opacity: 1,
		transition: {
			duration: 0.2,
			when: 'beforeChildren',
		},
	},
	hide: {
		opacity: 0,
		transition: {
			duration: 0.2,
			when: 'beforeChildren',
		},
	},
};
