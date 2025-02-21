import { create } from 'zustand';

const useMagnify = create((set) => ({
	mag: {
		content: null,
		url: null,
		isQueryUrl: false,
	},
	setMag: (mag) => set({ mag }),
	clearMag: () => set({ mag: { content: null, url: null, isQueryUrl: false } }),
}));

export default useMagnify;
