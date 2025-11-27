export type AuthResultType = {
    success: boolean,
    message: string,
    data: any
}

export interface ApiError {
    status: number;
    data: {
        message: string;
        // Add other fields your API returns
    };
}

import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { FormTemplateEnum } from './enums';

// A type guard is useful for checking if an unknown error matches your expected structure
export function isApiError(error: any): error is FetchBaseQueryError & { data: { message: string } } {
    return typeof error === 'object' && error !== null && 'status' in error;
}

export type FormTemplateType = typeof FormTemplateEnum[keyof typeof FormTemplateEnum];


export type CollectionFieldNameType = 'field_1' | 'field_2' | 'field_3' | 'field_4' | 'field_5' | 'field_6' | 'field_7' | 'field_8' | 'field_9' | 'field_10';
export type CollectionFieldNameSelectType = 'select_1' | 'select_2' | 'select_3' | 'select_4' | 'select_5' | 'select_6' | 'select_7' | 'select_8' | 'select_9' | 'select_10';