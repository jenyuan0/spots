import { create } from 'zustand';

const useSearchHotel = create((set) => ({
	searchContent: {
		heading: null,
		subheading: null,
		where: null,
	},
	setSearchContent: (content) => set({ searchContent: content }),
	clearContent: () =>
		set({ searchContent: { heading: null, subheading: null, where: null } }),
	searchHotelActive: false,
	setSearchHotelActive: (boolean) => set({ searchHotelActive: boolean }),
}));

export default useSearchHotel;
