import { create } from 'zustand';

const useSearchHotel = create((set) => ({
	searchContent: {
		hotel: null,
		heading: null,
		subheading: null,
		placeholder: null,
	},
	setSearchContent: (content) => set({ searchContent: content }),
	clearContent: () => set({ content: null }),
	searchHotelActive: false,
	setSearchHotelActive: (boolean) => set({ searchHotelActive: boolean }),
}));

export default useSearchHotel;
