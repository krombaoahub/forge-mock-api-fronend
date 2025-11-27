import type { WorkspaceStateInterface } from "@/interfaces";
import type { FormTemplateType } from "@/types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { DocumentData } from "firebase/firestore";

const initialState: WorkspaceStateInterface = {
    data: [],
    collections: [],
    selectedCollection: {},
    formTemplate: 'analytics',
    id: '',
}

export const workspaceSlice = createSlice({
    name: 'workspace',
    initialState,
    reducers: {
        setWorkspaces: (state: WorkspaceStateInterface, action: PayloadAction<DocumentData[]>) => {
            state.data = action.payload;
        },
        setCollections: (state: WorkspaceStateInterface, action: PayloadAction<DocumentData[]>) => {
            state.collections = action.payload;
        },
        setSelectedCollection: (state: WorkspaceStateInterface, action: PayloadAction<DocumentData>) => {
            state.selectedCollection = action.payload;
        },
        setId: (state: WorkspaceStateInterface, action: PayloadAction<string>) => {
            state.id = action.payload;
        },
        setWorkspaceFormTemplate: (state: WorkspaceStateInterface, action: PayloadAction<FormTemplateType>) => {
            state.formTemplate = action.payload
        }
    },
});

export const { setWorkspaces, setCollections, setSelectedCollection, setId,setWorkspaceFormTemplate } = workspaceSlice.actions;

export default workspaceSlice.reducer;