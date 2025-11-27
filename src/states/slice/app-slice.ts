import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AppStateInterface {
    loading: boolean;
    currentUser: any | null;
    errorMsg: string;
}

const initialState: AppStateInterface = {
    loading: false,
    currentUser: null,
    errorMsg: '',
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        setCurrentUser: (state, action: PayloadAction<any | null>) => {
            state.currentUser = action.payload
        },
        setErrorMsg: (state, action: PayloadAction<string>) => {
            state.errorMsg = action.payload
        }
    },
});

export const { setLoading, setCurrentUser, setErrorMsg } = appSlice.actions;

export default appSlice.reducer;