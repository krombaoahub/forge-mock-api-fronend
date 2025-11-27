import { AccountLayout } from "@/layouts/account-layout";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import { useAppContext } from "@/context/AppContext";
import { useCallback, useEffect } from "react";
import { TreeViewGroup } from "@/components/ui/tree-view";
import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { useGetWorkspaceByIdQuery } from "@/services/api";
import { workspaceSelector } from "@/states/slice/selector/workspace-selector";
import { AsideSkeleton } from "@/components/skeletons";
import { FormTemplateEnum } from "@/enums";
import Analytics from "./analytics";
import CollectionsForm from "./collections";
import EndpointsForm from "./endpoints";
import { setWorkspaceFormTemplate } from "@/states/slice/workspace-slice";


export function Workspace() {
    const { setBreadcrumbs } = useAppContext();
    const { id, formTemplate } = useAppSelector(workspaceSelector);
    const { data: workspace, isLoading, isError, refetch } = useGetWorkspaceByIdQuery(id);
    const dispatch = useAppDispatch()

    useEffect(() => {
        setBreadcrumbs([
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Workspace', path: `` }
        ]);
    }, [])

    const WorkspaceMainContent = useCallback(() => {
        switch (formTemplate) {
            case FormTemplateEnum.COLLECTIONS: return (<><CollectionsForm refetch={refetch} /></>)
            case FormTemplateEnum.ENDPOINTS: return (<EndpointsForm  />)
            default: return (<Analytics />)
        }
    }, [formTemplate])

    return (
        <AccountLayout>
            <div className="card p-6">
                <div className="w-full flex gap-4">
                    <aside className="grow shadow-lg min-h-90 max-w-60 border border-secondary/50 rounded-md">
                        {isLoading && !workspace ? <AsideSkeleton /> :
                            <>
                                <div className="px-3 py-2 font-bold text-lg truncate cursor-pointer" onClick={() => dispatch(setWorkspaceFormTemplate(FormTemplateEnum.ANALYTICS))}>{workspace.name}</div>
                                <div className="accordion-treeview-root" role="tree" aria-orientation="vertical">
                                    <div className="accordion" role="group" data-accordion-always-open>
                                        <TreeViewGroup sub={workspace.collections} isError={isError} name={FormTemplateEnum.COLLECTIONS} ref="collections-tree-view" />
                                        <TreeViewGroup sub={workspace.endpoints} isError={isError} name={FormTemplateEnum.ENDPOINTS} ref="endpoints-tree-view" />
                                    </div>
                                </div>
                            </>
                        }
                    </aside>
                    <main className="grow shadow-lg min-h-90 border border-secondary/50 rounded-md">
                        <div className="flex flex-col gap-4">
                            {/* <CollectionFields /> */}
                            {WorkspaceMainContent()}
                        </div>
                    </main>
                </div>
            </div >
        </AccountLayout >
    )
}

export default function WorkspacePage() {
    return (
        <WorkspaceProvider>
            <Workspace />
        </WorkspaceProvider >
    )
}