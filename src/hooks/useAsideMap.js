import { create } from 'zustand';

const useAsideMap = create((set) => ({
	locations: null,
	setAsideMapLocations: (locations) => set({ locations }),
	clearAsideMapLocations: () => set({ locations: null }),
	asideMapActive: false,
	setAsideMapActive: (boolean) => set({ asideMapActive: boolean }),
	asideMapExpand: false,
	setAsideMapExpand: (boolean) => set({ asideMapExpand: boolean }),
}));

export default useAsideMap;
