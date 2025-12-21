import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQuery } from "./api-service";
import { base64ToUtf8, buildPayload } from "@/libs/utils";
import type { DocumentData } from "firebase/firestore";
import type {
    CreateCollectionInterface, CreateWorkspaceInterface,
    DeleteCollectionInterface,
    WorkspaceEndpointResultInterface, WorkspaceResultInterface
} from "@/interfaces/api";

export const workspaceApi = createApi({
    reducerPath: 'workspaceApi',
    baseQuery: baseQuery,
    tagTypes: ['T_WORKSPACE', 'T_COLLECTION'],
    endpoints: (builder) => ({
        // ***GET***
        // workspace
        getWorkspaceCollections: builder.mutation({
            query: (params: { workspaceId: string }) => ({
                url: `/api/v1/collections/${params.workspaceId}`,
                method: 'GET'
            }),
            transformResponse: (res: string) => {
                return JSON.parse(base64ToUtf8(res))
            }
        }),
        getWorkspaces: builder.query<WorkspaceResultInterface[], string>({
            query: (userId) => `/api/v1/workspaces/${userId}`,
            providesTags: ['T_WORKSPACE']
        }),
        getWorkspaceById: builder.query<WorkspaceResultInterface, string>({
            query: (workspaceId) => `/api/v1/workspace/${workspaceId}`,
            transformResponse: (res: string) => {
                return JSON.parse(base64ToUtf8(res))
            }
        }),
        // collection
        getCollectionFields: builder.mutation({
            query: (params: { workspaceId: string, collectionId: string }) => ({
                url: `/api/v1/collection/${params.workspaceId}/${params.collectionId}`,
                method: 'GET'
            }),
            transformResponse: (res: string) => {
                return JSON.parse(base64ToUtf8(res))
            }
        }),
        getCollectionData: builder.mutation({
            query: (params: { workspaceId: string, collectionId: string }) => ({
                url: `/api/v1/collection-data/${params.workspaceId}/${params.collectionId}`,
                method: 'GET'
            }),
            transformResponse: (res: string) => {
                return JSON.parse(base64ToUtf8(res))
            }
        }),
        // endpoint
        getWorkspaceEndpoint: builder.query<WorkspaceEndpointResultInterface, string>({
            query: (workspaceId) => `/api/v1/endpoints/${workspaceId}`
        }),

        // ***POST***
        // workspace
        addWorkspace: builder.mutation({
            query: (body: CreateWorkspaceInterface) => (buildPayload('/api/v1/workspace', body)),
            invalidatesTags: ['T_WORKSPACE'],
        }),
        // collection
        saveCollection: builder.mutation({
            query: (body: CreateCollectionInterface) => {
                return buildPayload('/api/v1/collection', body)
            },
            invalidatesTags: ['T_COLLECTION'],
        }),

        // ***DELETE***
        // workspace
        deleteWorkspace: builder.mutation({
            query: (body: DocumentData) => {
                return buildPayload(`/api/v1/workspace/${body.id}`, {}, 'DELETE')
            },
            invalidatesTags: ['T_WORKSPACE'],
        }),
        // collection
        deleteCollection: builder.mutation({
            query: (body: DeleteCollectionInterface) => {
                return buildPayload(`/api/v1/collection/${body.workspaceId}/${body.collectionId}`, {}, 'DELETE')
            },
            invalidatesTags: ['T_COLLECTION'],
        }),
    })
})

export const {
    // Query
    useGetWorkspacesQuery,
    useGetWorkspaceByIdQuery,
    useGetWorkspaceEndpointQuery,
    // mutations
    useGetWorkspaceCollectionsMutation,
    useGetCollectionFieldsMutation,
    useAddWorkspaceMutation,
    useGetCollectionDataMutation,
    useSaveCollectionMutation,
    useDeleteWorkspaceMutation,
    useDeleteCollectionMutation
} = workspaceApi