import type { EndpointStateInterface, EndpointFieldInteface, EndpointResponseFieldInteface } from "@/interfaces";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState: EndpointStateInterface = {
    selectFields: [],
    responseFields: []
}

export const endpointSlice = createSlice({
    name: 'endpoints',
    initialState,
    reducers: {
        setSelectFields: (state: EndpointStateInterface, action: PayloadAction<EndpointFieldInteface[]>) => {
            state.selectFields = action.payload;
        },
        setResponseField: (state: EndpointStateInterface, action: PayloadAction<EndpointResponseFieldInteface[]>) => {
            state.responseFields = action.payload;
        },
    },
});

export const { setSelectFields, setResponseField } = endpointSlice.actions;

export default endpointSlice.reducer;