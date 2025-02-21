import { create } from 'zustand';

const useMagnify = create((set) => ({
	mag: {
		data: null,
		type: null,
		color: null,
	},
	setMag: (mag) => set({ mag }),
	clearMag: () => set({ mag: { content: null, url: null } }),
}));

export default useMagnify;
