import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	progressStatus: '',
};

export const globalProgressLoaderSlice = createSlice({
	name: 'globalProgressLoader',
	initialState,
	reducers: {
		setProgressStatus: (state, action) => {
			state.progressStatus = action.payload;
		},
	},
});

export const { setProgressStatus } = globalProgressLoaderSlice.actions;

export default globalProgressLoaderSlice.reducer;
