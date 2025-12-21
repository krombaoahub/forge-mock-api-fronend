import type { DocumentData } from "firebase/firestore"
import type { CollectionSchemaInterface } from "."

export interface CreateWorkspaceInterface {
    name: string
    ownerId?: string
}

export interface CreateCollectionInterface {
    workspaceId: string | undefined
    name: string
    schemaFields: { name: string, type: string }[]
    dataCount: number
    id: string
}

export interface IdNameOwnerCreatedInterface {
    createdAt: bigint
    id: string
    name: string
    ownerId: string
}
export interface CollectionInterface extends IdNameOwnerCreatedInterface {
    dataCount: number
    schemaFields: CollectionSchemaInterface[]
}
export interface EndpointInterface extends IdNameOwnerCreatedInterface {
    data?: DocumentData[]
}
export interface WorkspaceEndpointResultInterface extends IdNameOwnerCreatedInterface {
    data?: DocumentData[]
}
export interface WorkspaceCollectionDataResultInterface  {
    data?: DocumentData[]
}
export interface WorkspaceResultInterface extends IdNameOwnerCreatedInterface {
    collections?: DocumentData[] | undefined
    endpoints?: DocumentData[] | undefined
}
export interface DeleteCollectionInterface {
    workspaceId?: string | undefined
    collectionId: string
}