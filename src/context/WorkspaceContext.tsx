import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import type { WorkspaceContextInterface } from '@/interfaces';
import { createWorkspace, getCollectionById, getWorkspaceByUserId } from '@/services/workspace-service';
import { Outlet, useParams } from 'react-router-dom';
import { reInitFlyonUi } from '@/hooks/use-init-flyoui';
import { useAppDispatch, useAppSelector } from '@/states/hooks';
import { setErrorMsg, setLoading } from '@/states/slice/app-slice';
import { setSelectedCollection, setId, setWorkspaces } from '@/states/slice/workspace-slice';
// import { getCollections } from "@/services/workspace-service";
// import { setCollections } from "@/states/slice/workspace-slice";
import type { DocumentData } from "firebase/firestore";

const WorkspaceContext = createContext<WorkspaceContextInterface | undefined>(undefined);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
    const { workspaceId } = useParams()
    const currentUser = useAppSelector((state) => state.app.currentUser);
    const dispatch = useAppDispatch()
    const [providerLoading, setProviderLoading] = useState<boolean>(true);

    useEffect(() => {
        console.log('Fetching workspaces...')
        setProviderLoading(true)
        handleGetWorkspace().finally(() => {
            setProviderLoading(false);
            reInitFlyonUi()
            // handleGetCollections()
        })
        workspaceId && dispatch(setId(workspaceId))
    }, [])

    const handleGetCollectionById = useCallback(async (collectionId?: string) => {
        if (!workspaceId) { return setSelectedCollection({}); }
        return await getCollectionById(workspaceId, collectionId || '')
            .then((data) => dispatch(setSelectedCollection((data ?? {}) as DocumentData)))
            .catch((error) => dispatch(setErrorMsg(error.message)));
    }, [workspaceId])

    // const handleGetCollections = useCallback(async () => {
    //     if (!workspaceId) { return setCollections([]); }
    //     return await getCollections(workspaceId)
    //         .then((data) => dispatch(setCollections((data ?? []) as DocumentData[])))
    //         .catch((error) => dispatch(setErrorMsg(error.message)));
    // }, [workspaceId])

    const handleGetWorkspace = useCallback(async () => {
        return await getWorkspaceByUserId(currentUser.localId)
            .then((data) => dispatch(setWorkspaces(data)))
            .catch((error) => dispatch(setErrorMsg(error.message)))
    }, [currentUser.localId])

    const handleCreateWorkspace = async (data: any, callback?: () => void) => {
        dispatch(setErrorMsg(''))
        dispatch(setLoading(true))
        await createWorkspace(currentUser.localId, data.name)
            .then((docRef) => {
                console.log("New workspaces added with ID:", docRef.id);
                callback && callback()
            })
            .catch((error) => dispatch(setErrorMsg(error.message)))
            .finally(() => dispatch(setLoading(false)))
    }

    const context = {
        handleCreateWorkspace,
        handleGetWorkspace,
        // handleGetCollections,
        handleGetCollectionById
    };

    return (
        <WorkspaceContext.Provider value={context}>
            {!providerLoading ? children : <Outlet />}
        </WorkspaceContext.Provider>
    );
};

export const useWorkspaceContext = () => {
    const context = useContext(WorkspaceContext);
    if (!context) throw new Error('useAppContext must be used within AppProvider');
    return context;
};

