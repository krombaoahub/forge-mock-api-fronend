
import type { StateSelectorInterface } from "@/interfaces";
import { createSelector } from "@reduxjs/toolkit";

const selectFieldsT = (state: StateSelectorInterface) => state.endpoint.selectFields
const responseFieldsT = (state: StateSelectorInterface) => state.endpoint.responseFields

export const endpointSelector = createSelector([
    selectFieldsT,
    responseFieldsT
], (
    selectFields,
    responseFields
) => {
    return {
        selectFields,
        responseFields
    }
});