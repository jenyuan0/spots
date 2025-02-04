import { configureStore } from '@reduxjs/toolkit';
import globalProgressLoaderReducer from '@/store/global/progressLoaderSlice';

export const makeStore = () => {
	return configureStore({
		reducer: {
			globalProgressLoader: globalProgressLoaderReducer,
		},
	});
};
