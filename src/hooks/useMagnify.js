import { create } from 'zustand';

const useMagnify = create((set) => ({
	mag: [],

	// Add to the end of the stack
	addMag: (item) =>
		set((state) => ({
			mag: [...state.mag, item],
		})),

	// Remove the last (top-most) item
	removeMag: () =>
		set((state) => ({
			mag: state.mag.slice(0, -1),
		})),

	// Clear all layers
	clearMag: () => set({ mag: [] }),
}));

export default useMagnify;
