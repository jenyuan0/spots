import { create } from 'zustand';

const usePlanner = create((set) => ({
	plannerContent: {
		type: null,
		heading: null,
		subheading: null,
		where: null,
	},
	setPlannerContent: (content) => set({ plannerContent: content }),
	clearPlannerContent: () =>
		set({
			plannerContent: {
				type: null,
				heading: null,
				subheading: null,
				where: null,
			},
		}),
	plannerActive: false,
	setPlannerActive: (boolean) => set({ plannerActive: boolean }),
}));

export default usePlanner;
