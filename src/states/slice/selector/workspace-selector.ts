
import type { StateSelectorInterface } from "@/interfaces";
import { createSelector } from "@reduxjs/toolkit";

const dataT = (state: StateSelectorInterface) => state.workspace.data
const collectionsT = (state: StateSelectorInterface) => state.workspace.collections
const selectedCollectionT = (state: StateSelectorInterface) => state.workspace.selectedCollection
const idT = (state: StateSelectorInterface) => state.workspace.id
const formTemplateT = (state: StateSelectorInterface) => state.workspace.formTemplate

export const workspaceSelector = createSelector([
    dataT,
    collectionsT,
    selectedCollectionT,
    idT,
    formTemplateT
], (
    data,
    collections,
    selectedCollection,
    id,
    formTemplate
) => {
    return {
        data,
        collections,
        selectedCollection,
        id,
        formTemplate
    }
});