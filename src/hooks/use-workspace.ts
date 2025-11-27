import { useGetCollectionFieldsMutation } from "@/services/api";
import { useAppDispatch } from "@/states/hooks";
import { setDataCount, setId, setName, setSchemeFields, setLoading, initialState } from "@/states/slice/collection-slice";
import { setWorkspaceFormTemplate } from "@/states/slice/workspace-slice";
import type { FormTemplateType } from "@/types";
import { HSSelect } from "flyonui/flyonui";
import { useCallback, useEffect } from "react";

export function useGetCollection() {
    const dispatch = useAppDispatch()
    const [getCollectionFields, { isLoading }] = useGetCollectionFieldsMutation()

    useEffect(() => {
        dispatch(setLoading(isLoading))
    }, [isLoading])

    const newCollection = useCallback(async (type: FormTemplateType, workspaceId: string, collectionId: string) => {

        dispatch(setWorkspaceFormTemplate(type))
        dispatch(setLoading(isLoading))
        let { id, schemeFields, name, dataCount } = initialState

        if (collectionId) {
            const response = await getCollectionFields({ workspaceId, collectionId })
            const data = await response.data
            console.log({ data })
            id = data.id
            name = data.name
            schemeFields = data.schemeFields
            dataCount = data.dataCount
        }

        dispatch(setId(id))
        dispatch(setName(name))
        dispatch(setSchemeFields(schemeFields))
        dispatch(setDataCount(dataCount))

        setTimeout(() => {
            HSSelect.autoInit()
        }, 10);
    }, []);

    return newCollection;
} 