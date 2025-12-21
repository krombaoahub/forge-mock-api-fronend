import type { StateSelectorInterface } from "@/interfaces";
import { createSelector } from "@reduxjs/toolkit";

const loadingT = (state: StateSelectorInterface) => state.app.loading;
const errorMsgT = (state: StateSelectorInterface) => state.app.errorMsg;

export const loadingAndErrorSelector = createSelector([loadingT, errorMsgT], (loading, errorMsg) => { return { loading, errorMsg } });