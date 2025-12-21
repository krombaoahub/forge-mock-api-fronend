
import type { FormTemplateEnum } from "@/enums"
import type { FormTemplateType } from "@/types"
import type { DocumentData } from "firebase/firestore"
import type React from "react"
import type { FieldErrors, UseFormRegister, FieldValues } from "react-hook-form"
import type { NavigateFunction } from "react-router-dom"
import type { UserImplInterface } from "./firebaseAuth"
import type { CreateWorkspaceFormFields, FormSchemaFields, LoginFormFields, RegisterFormFields } from "@/zod/schema"
import type { FormEventHandler } from "react"

// Form
export interface LoginFormInterface {
    email: string
    password: string
}

export interface RegisterFormInterface {
    name: string
    email: string
    password: string
    confirmPassword: string
}
export type FormFieldsType = RegisterFormFields | LoginFormFields | CreateWorkspaceFormFields

export interface FormInterface extends React.HTMLAttributes<HTMLFormElement> {
    inputs: {
        className?: string
        keyId?: string
        register: UseFormRegister<FormSchemaFields>
        errors?: FieldErrors<FieldValues>
        type?: string
        placeholder?: string
        label?: string
        field: keyof FormSchemaFields
        passwordMeter?: boolean
    }[]
    children: React.ReactNode
    handleSubmit: FormEventHandler<HTMLFormElement>
}

export interface FormInputInterface {
    className?: string
    keyId?: string
    register: UseFormRegister<FormSchemaFields>
    errors?: FieldErrors<FieldValues>
    type?: string
    placeholder?: string
    label?: string
    field?: keyof FormSchemaFields
    passwordMeter?: boolean
}

export interface FormComponentInterface extends React.HTMLAttributes<HTMLFormElement> {
    children: React.ReactNode
    inputFields: InputFormInterface
    handleSubmit: FormEventHandler<HTMLFormElement>
}
export type TInputTypes = 'password' | 'text'

export interface InputFormInterface {
    placeholder: string
    label: string
    type: TInputTypes,
}

export interface PasswordMeterInterface {
    targetElement: string
}

export interface AuthContextInterface {
    // currentUser: any | null
    // loading: boolean
    // errorMsg: string
    handleRegister: (data: RegisterFormInterface, navigate: NavigateFunction) => void
    handleLogin: (loginField: LoginFormInterface, navigate: NavigateFunction) => void
    handleLogout: (navigate: NavigateFunction) => void
    // setErrorMsg: (msg: string) => void
}

export interface WorkspaceContextInterface {
    handleCreateWorkspace: (data: { name: string }, callback?: () => void) => void
    handleGetWorkspace: () => void
    // handleGetCollections: () => void
    handleGetCollectionById: (id: string) => void
}

export interface SaveUserProfileInterface {
    email: string
    name: string
    phoneNumber?: string
    photoURL?: string
}

export interface AppLogoInterface extends React.HTMLAttributes<HTMLDivElement> {
    logoOnly?: boolean
    logoSize?: number
}

export interface HeaderInterface {
    dashboardHeader?: boolean
}

export interface CreateWorkspaceModalInterface extends React.HTMLAttributes<HTMLElement> {
    refId: string
    refetch: () => void
}
export interface DeleteWorkspaceModalInterface extends React.HTMLAttributes<HTMLElement> {
    refId: string
    refetch: () => void
}
export interface DeleteCollectionModalInterface extends React.HTMLAttributes<HTMLElement> {
    refId: string
    workspaceId: string
    refetch: () => void
}
export interface EndpointFieldInteface extends CollectionSchemaInterface { collection: string, collectionType?: string, value: string }
export interface EndpointResponseFieldInteface {
    input?: string
    select?: string
}
export interface EndpointStateInterface {
    selectFields: EndpointFieldInteface[]
    responseFields: EndpointResponseFieldInteface[]
}
export interface WorkspaceStateInterface {
    data: DocumentData[];
    collections: DocumentData[];
    selectedCollection: DocumentData;
    formTemplate: FormTemplateType;
    id: string;
}

export interface StateSelectorInterface {
    workspace: WorkspaceStateInterface
    collection: CollectionStateInterface
    app: AppStateInterface
    endpoint: EndpointStateInterface
}

export type SubTreeInterface = {
    id: string,
    name: string,
    type: typeof FormTemplateEnum[keyof typeof FormTemplateEnum],
    refetch: () => void
}

export type TreeViewGroupInterface = {
    name: typeof FormTemplateEnum[keyof typeof FormTemplateEnum],
    sub: DocumentData[] | undefined,
    ref: string,
    isError: boolean,
    refetch: () => void
}
export type TreeViewGroupBtnInterface = {
    nameType: typeof FormTemplateEnum[keyof typeof FormTemplateEnum],
    ref: string
}

export interface SchemaFieldsInterface {
    fields: CollectionSchemaInterface,
    spaceCount?: number
    comma?: string
}
export interface SchemaDataInterface {
    fields: CollectionSchemaDataInterface,
    spaceCount?: number
    comma?: string
}

export interface CollectionSchemaInterface {
    name: string,
    type: string,
}
export interface CollectionSchemaDataInterface {
    name: string,
    value: string
}

export interface NameTypeInterface {
    name: string,
    type: string
}

export interface FakerInterface {
    group: string,
    type: string
}

export interface CollectionStateInterface {
    id: string
    schemaFields: CollectionSchemaInterface[]
    name: string
    dataCount: number
    maxFieldCount: number
    data: DocumentData[]
    loading: boolean
}
export interface AppStateInterface {
    errorMsg: string
    loading: boolean
    currentUser?: UserImplInterface
}

export type DataValue = string | object | number | boolean | bigint
export interface DataFieldValue { [key: string]: DataValue }