import type { CollectionSchemeInterface, CollectionStateInterface } from "@/interfaces";
import { createAction, createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DocumentData } from "firebase/firestore";

export const resetCollection = createAction('REVERT_ALL');

export const initialState: CollectionStateInterface = {
    id: '',
    schemeFields: [{ name: '', type: 'string.uuid' }],
    name: '',
    dataCount: 10,
    maxFieldCount: 5,
    data: [],
    loading: false,
}

export const collectionSlice = createSlice({
    name: 'collection',
    initialState,
    reducers: {
        setId: (state: CollectionStateInterface, action: PayloadAction<string>) => { state.id = action.payload },
        setSchemeFields: (state: CollectionStateInterface, action: PayloadAction<CollectionSchemeInterface[]>) => { state.schemeFields = action.payload },
        setName: (state: CollectionStateInterface, action: PayloadAction<string>) => { state.name = action.payload },
        setDataCount: (state: CollectionStateInterface, action: PayloadAction<number>) => { state.dataCount = action.payload },
        setMaxFieldCount: (state: CollectionStateInterface, action: PayloadAction<number>) => { state.maxFieldCount = action.payload },
        setData: (state: CollectionStateInterface, action: PayloadAction<DocumentData[]>) => { state.data = action.payload },
        setLoading: (state: CollectionStateInterface, action: PayloadAction<boolean>) => { state.loading = action.payload },
    },
    extraReducers: (builder) => {
        builder.addCase(resetCollection, () => initialState); // Reset to initial state
    },
});

export const {
    setId,
    setSchemeFields,
    setName,
    setDataCount,
    setMaxFieldCount,
    setData,
    setLoading
} = collectionSlice.actions;

export default collectionSlice.reducer;