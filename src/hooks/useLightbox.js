import { create } from 'zustand';

const useLightbox = create((set) => ({
	lightboxImages: {
		images: null,
		activeIndex: 0,
	},
	setLightboxImages: (images, activeIndex = 0) =>
		set({ lightboxImages: { images, activeIndex } }),
	clearLightboxImages: () => set({ lightboxImages: [] }),
	lightboxActive: false,
	setLightboxActive: (boolean) => set({ lightboxActive: boolean }),
}));

export default useLightbox;
