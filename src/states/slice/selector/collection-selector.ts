
import type { StateSelectorInterface } from "@/interfaces";
import { createSelector } from "@reduxjs/toolkit";

const idT = (state: StateSelectorInterface) => state.collection.id
const schemeFieldsT = (state: StateSelectorInterface) => state.collection.schemeFields
const nameT = (state: StateSelectorInterface) => state.collection.name
const dataCountT = (state: StateSelectorInterface) => state.collection.dataCount
const maxFieldCountT = (state: StateSelectorInterface) => state.collection.maxFieldCount
const dataT = (state: StateSelectorInterface) => state.collection.data
const loadingT = (state: StateSelectorInterface) => state.collection.loading

export const collectionSelector = createSelector([
    idT,
    schemeFieldsT,
    nameT,
    dataCountT,
    maxFieldCountT,
    dataT,
    loadingT
], (
    id,
    schemeFields,
    name,
    dataCount,
    maxFieldCount,
    data,
    loading
) => {
    return {
        id,
        schemeFields,
        name,
        dataCount,
        maxFieldCount,
        data,
        loading
    }
});