import { createSelector } from "@reduxjs/toolkit";

const loadingT = (state: any) => state.app.loading;
const errorMsgT = (state: any) => state.app.errorMsg;

export const loadingAndErrorSelector = createSelector([loadingT, errorMsgT], (loading, errorMsg) => { return { loading, errorMsg } });