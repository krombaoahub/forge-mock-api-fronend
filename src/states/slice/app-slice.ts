import type { UserImplInterface } from "@/interfaces/firebaseAuth";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AppStateInterface {
    loading: boolean;
    currentUser?: UserImplInterface;
    errorMsg: string;
}

const initialState: AppStateInterface = {
    loading: false,
    currentUser: undefined,
    errorMsg: '',
}

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
        setCurrentUser: (state, action: PayloadAction<UserImplInterface | undefined>) => {
            state.currentUser = action.payload
        },
        setErrorMsg: (state, action: PayloadAction<string>) => {
            state.errorMsg = action.payload
        }
    },
});

export const { setLoading, setCurrentUser, setErrorMsg } = appSlice.actions;

export default appSlice.reducer;