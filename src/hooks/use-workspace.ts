import { FormTemplateEnum } from "@/enums";
import { useGetCollectionFieldsMutation, useGetWorkspaceCollectionsMutation } from "@/services/api";
import { useAppDispatch } from "@/states/hooks";
import { setDataCount, setId, setName, setSchemaFields, setLoading, initialState, resetCollection } from "@/states/slice/collection-slice";
import { setCollections, setWorkspaceFormTemplate } from "@/states/slice/workspace-slice";
import type { FormTemplateType } from "@/types";
import { HSSelect } from "flyonui/flyonui";
import { useCallback, useEffect } from "react";

export function useGetWorkspaceCollections() {
    const dispatch = useAppDispatch()
    const [getWorkspaceCollections, { isLoading }] = useGetWorkspaceCollectionsMutation()

    useEffect(() => {
        dispatch(setLoading(isLoading))
    }, [dispatch, isLoading])

    const onHandleGetWorkspaceCollections = useCallback(async (workspaceId: string) => {
        const response = await getWorkspaceCollections({ workspaceId })
        const data = await response
        dispatch(setCollections(data?.data || []))
    }, [dispatch, getWorkspaceCollections])

    return onHandleGetWorkspaceCollections
}
export function useDispatchCollectionData() {
    const dispatch = useAppDispatch()
    const [getCollectionFields, { isLoading }] = useGetCollectionFieldsMutation()

    useEffect(() => {
        dispatch(setLoading(isLoading))
    }, [dispatch, isLoading])

    const onHandleCollectionDispatch = useCallback(async (dataId: string, workspaceId: string) => {
        let { id, schemaFields, name, dataCount } = initialState
        if (dataId) {
            const response = await getCollectionFields({ workspaceId, collectionId: dataId })
            const data = await response.data
            id = data.id
            name = data.name
            schemaFields = data.schemaFields
            dataCount = data.dataCount
        }

        dispatch(resetCollection())

        dispatch(setId(id))
        dispatch(setName(name))
        dispatch(setSchemaFields(schemaFields))
        dispatch(setDataCount(dataCount))
        // dispatch(setData(dataschema))
    }, [dispatch, getCollectionFields]);

    return onHandleCollectionDispatch
}

export function useMainWorkspaceComponent() {
    const dispatch = useAppDispatch()
    const onUseDispatchCollectionData = useDispatchCollectionData()

    const onHandleComponentChange = useCallback(async (type: FormTemplateType, workspaceId: string, dataId: string) => {

        dispatch(setWorkspaceFormTemplate(type))
        switch (type) {
            case FormTemplateEnum.COLLECTIONS:
                // collectionLoading
                dispatch(setLoading(true))
                await onUseDispatchCollectionData(dataId, workspaceId)
                setTimeout(() => { dispatch(setLoading(false)) }, 10);
                break;
            default:
                break;
        }

        setTimeout(() => {
            HSSelect.autoInit()
        }, 10);
    }, [dispatch, onUseDispatchCollectionData]);

    return onHandleComponentChange;
}

export function useResetMainWorkspaceComponent() {
    const dispatch = useAppDispatch()
    const handleUseGetCollection = useMainWorkspaceComponent()

    const onHandleComponentChange = useCallback((nameType: FormTemplateType) => {
        handleUseGetCollection(nameType, '', '')
        dispatch(resetCollection())
        dispatch(setWorkspaceFormTemplate(nameType))

        switch (nameType) {
            case FormTemplateEnum.COLLECTIONS:
                // collectionLoading
                dispatch(setLoading(true))
                setTimeout(() => { dispatch(setLoading(false)) }, 10);
                break;
            default:
                break;
        }

        setTimeout(() => { HSSelect.autoInit() }, 10);
    }, [dispatch, handleUseGetCollection])

    return onHandleComponentChange;
}