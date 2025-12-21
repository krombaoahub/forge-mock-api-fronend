import { createContext, useEffect, useState, type ReactNode } from 'react';
// import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
// import type { StateSelectorInterface, WorkspaceContextInterface } from '@/interfaces';
// import { createWorkspace, getCollectionById, getWorkspaceByUserId } from '@/services/workspace-service';
// import { Outlet, useParams } from 'react-router-dom';
import { Outlet, useParams } from 'react-router-dom';
// import { reInitFlyonUi } from '@/hooks/use-init-flyoui';
// import { useAppDispatch, useAppSelector } from '@/states/hooks';
// import { setErrorMsg, setLoading } from '@/states/slice/app-slice';
// import { setSelectedCollection, setId, setWorkspaces } from '@/states/slice/workspace-slice';
// import type { DocumentData } from "firebase/firestore";

const WorkspaceContext = createContext<{workspaceId: string | undefined} | undefined>(undefined);
// const WorkspaceContext = createContext<{WorkspaceContextInterface} | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
    const { workspaceId } = useParams()
    // const currentUser = useAppSelector((state: StateSelectorInterface) => state.app.currentUser);
    // const dispatch = useAppDispatch()
    const [providerLoading, setProviderLoading] = useState<boolean>(true);

    // const currentUserId = currentUser ? currentUser.uid : ''

    // const handleGetWorkspace = useCallback(async () => {
    //     return currentUserId ? await getWorkspaceByUserId(currentUserId)
    //         .then((data: DocumentData[]) => dispatch(setWorkspaces(data ?? [])))
    //         .catch((error: DocumentData) => dispatch(setErrorMsg(error.message))) : []
    // }, [currentUserId, dispatch])

    useEffect(() => {
        setProviderLoading(true)
    }, [])

    // useEffect(() => {
    //     setProviderLoading(true)
    //     handleGetWorkspace().finally(() => {
    //         setProviderLoading(false);
    //         reInitFlyonUi()
    //     })
    //     if (workspaceId) dispatch(setId(workspaceId))
    // }, [dispatch, workspaceId, handleGetWorkspace])

    // const handleGetCollectionById = useCallback(async (collectionId?: string) => {
    //     if (!workspaceId) { return setSelectedCollection({}); }
    //     return await getCollectionById(workspaceId, collectionId || '')
    //         .then((data: DocumentData) => dispatch(setSelectedCollection((data ?? {}) as DocumentData)))
    //         .catch((error: DocumentData) => dispatch(setErrorMsg(error.message)));
    // }, [workspaceId, dispatch])

    // // const handleGetCollections = useCallback(async () => {
    // //     if (!workspaceId) { return setCollections([]); }
    // //     return await getCollections(workspaceId)
    // //         .then((data) => dispatch(setCollections((data ?? []) as DocumentData[])))
    // //         .catch((error) => dispatch(setErrorMsg(error.message)));
    // // }, [workspaceId])

    // const handleCreateWorkspace = async (data: { name: string }, callback?: () => void) => {
    //     dispatch(setErrorMsg(''))
    //     dispatch(setLoading(true))
    //     if (currentUserId) {
    //         await createWorkspace(currentUserId, data.name)
    //             .then(() => {
    //                 if (callback) callback()
    //             })
    //             .catch((error: DocumentData) => dispatch(setErrorMsg(error.message)))
    //             .finally(() => dispatch(setLoading(false)))
    //     }
    // }

    const context = {
        // handleCreateWorkspace,
        // handleGetWorkspace,
        // // handleGetCollections,
        // handleGetCollectionById
        workspaceId
    };

    return (
        <WorkspaceContext.Provider value={context}>
            {!providerLoading ? children : <Outlet />}
        </WorkspaceContext.Provider>
    );
};
