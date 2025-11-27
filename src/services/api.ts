import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithRetry } from "./api-service";
import { buildPayload } from "@/libs/utils";
import type { DocumentData } from "firebase/firestore";

interface CreateWorkspaceInterface {
    name: string
    ownerId: string
}
interface CreateCollectionInterface {
    workspaceId: string | undefined
    name: string
    schemeFields: { name: string, type: string }[]
    dataCount: number
}

export const workspaceApi = createApi({
    reducerPath: 'workspaceApi',
    baseQuery: baseQueryWithRetry,
    tagTypes: ['T_WORKSPACE', 'T_COLLECTION'],
    endpoints: (builder) => ({
        // ***GET***
        // workspace
        getWorkspaces: builder.query<any, string>({
            query: (userId) => `/api/v1/workspaces/${userId}`,
            providesTags: ['T_WORKSPACE']
        }),
        getWorkspaceById: builder.query<any, string>({
            query: (workspaceId) => `/api/v1/workspace/${workspaceId}`
        }),
        // collection
        getCollectionFields: builder.mutation({
            query: (params: { workspaceId: string, collectionId: string }) => ({
                url: `/api/v1/collection/${params.workspaceId}/${params.collectionId}`,
                method: 'GET'
            }),
            transformResponse: (res: string) => {
                return JSON.parse(atob(res))
            }
        }),
        getCollectionData: builder.query<any, { workspaceId: string; collectionId: string }>({
            query: ({ workspaceId, collectionId }) => `/api/v1/collection-data/${workspaceId}/${collectionId}`
        }),
        // endpoint
        getWorkspaceEndpoint: builder.query<any, string>({
            query: (workspaceId) => `/api/v1/endpoints/${workspaceId}`
        }),

        // ***POST***
        // workspace
        addWorkspace: builder.mutation({
            query: (body: CreateWorkspaceInterface) => (buildPayload('/api/v1/workspace', body)),
            invalidatesTags: ['T_WORKSPACE'], // Invalidates the 'Post' cache, triggering re-fetch of 'getPosts'
        }),
        // collection
        saveCollection: builder.mutation({
            query: (body: CreateCollectionInterface) => {
                return buildPayload('/api/v1/collection', body)
            },
            invalidatesTags: ['T_COLLECTION'], // Invalidates the 'Post' cache, triggering re-fetch of 'getPosts'
        }),

        // ***POST***
        // workspace
        deleteWorkspace: builder.mutation({
            query: (body: DocumentData) => {
                return buildPayload(`/api/v1/workspace/${body.id}`, {}, 'DELETE')
            },
            invalidatesTags: ['T_COLLECTION'], // Invalidates the 'Post' cache, triggering re-fetch of 'getPosts'
        }),
    })
})

export const {
    useGetWorkspacesQuery,
    useGetWorkspaceByIdQuery,
    useGetCollectionFieldsMutation,
    useGetCollectionDataQuery,
    useGetWorkspaceEndpointQuery,
    useAddWorkspaceMutation,
    useSaveCollectionMutation,
    useDeleteWorkspaceMutation
} = workspaceApi