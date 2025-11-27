
import type { FormTemplateEnum } from "@/enums"
import type { FormTemplateType } from "@/types"
import type { DocumentData } from "firebase/firestore"
import type React from "react"
import type { FieldErrors, UseFormRegister } from "react-hook-form"
import type { NavigateFunction } from "react-router-dom"

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

export interface FormInterface extends React.HTMLAttributes<HTMLFormElement> {
    inputs: FormInputInterface[]
    children: React.ReactNode
    handleSubmit: (data: any) => void
}

export interface FormInputInterface {
    className?: string
    keyId?: string
    register: UseFormRegister<any>
    errors?: FieldErrors<any>
    type?: string
    placeholder?: string
    label?: string
    field?: string
    passwordMeter?: boolean
}

export interface PasswordMeterInterface {
    targetElement: string
}

export interface AuthContextInterface {
    // currentUser: any | null
    // loading: boolean
    // errorMsg: string
    handleRegister: (data: RegisterFormInterface, navigate: NavigateFunction) => {}
    handleLogin: (loginField: LoginFormInterface, navigate: NavigateFunction) => {}
    handleLogout: (navigate: NavigateFunction) => void
    // setErrorMsg: (msg: string) => void
}

export interface WorkspaceContextInterface {
    handleCreateWorkspace: (data: any, callback?: () => void) => void
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
    dataCount:number
    refetch: () => void
}
export interface DeleteWorkspaceModalInterface extends React.HTMLAttributes<HTMLElement> {
    refId: string
    dataCount:number
    id:string
    refetch: () => void
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
}

export type SubTreeInterface = {
    id: string,
    name: string
    type: typeof FormTemplateEnum[keyof typeof FormTemplateEnum]
}

export type TreeViewGroupInterface = {
    name: typeof FormTemplateEnum[keyof typeof FormTemplateEnum],
    sub: DocumentData[],
    ref: string,
    isError: boolean
}
export type TreeViewGroupBtnInterface = {
    nameType: typeof FormTemplateEnum[keyof typeof FormTemplateEnum],
    ref: string
}

export interface CollectionSchemeInterface {
    name: string,
    type: string
}

export interface SchemeFieldsInterface {
    fields: CollectionSchemeInterface,
    spaceCount?: number
    comma?: string
}

export interface CollectionSchemeInterface {
    name: string,
    type: string
}

export interface CollectionStateInterface {
    id: string
    schemeFields: CollectionSchemeInterface[]
    name: string
    dataCount: number
    maxFieldCount: number
    data: DocumentData[]
    loading: boolean
}