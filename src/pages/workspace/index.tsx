import { AccountLayout } from "@/layouts/account-layout";
import { useAppContext } from "@/context";
import { useCallback, useEffect } from "react";
import { TreeViewGroup } from "@/pages/workspace/tree-view";
import { useAppDispatch, useAppSelector } from "@/states/hooks";
import { useGetWorkspaceByIdQuery } from "@/services/api";
import { workspaceSelector } from "@/states/slice/selector/workspace-selector";
import { AsideSkeleton } from "@/components/skeletons";
import { FormTemplateEnum } from "@/enums";
import Analytics from "./analytics";
import CollectionsForm from "./collections";
import EndpointsForm from "./endpoints";
import { setWorkspaceFormTemplate } from "@/states/slice/workspace-slice";
import { useParams } from "react-router-dom";
import { useResetMainWorkspaceComponent } from "@/hooks/use-workspace";
import DeleteCollectionModal from "./delete-collections-modal";
import { HSAccordion } from "flyonui/flyonui";

export default function WorkspacePage() {
    const { workspaceId } = useParams();
    const { setBreadcrumbs } = useAppContext();
    const { formTemplate } = useAppSelector(workspaceSelector);
    const { data: workspace, isLoading, isError, refetch } = useGetWorkspaceByIdQuery(workspaceId || '');
    const dispatch = useAppDispatch()
    const handleUseResetMainWorkspaceComponent = useResetMainWorkspaceComponent()

    useEffect(() => {
        HSAccordion.autoInit()
    }, [isLoading])

    useEffect(() => {
        setBreadcrumbs([
            { name: 'Dashboard', path: '/dashboard' },
            { name: 'Workspace', path: `` }
        ]);

        return () => {
            handleUseResetMainWorkspaceComponent(FormTemplateEnum.ANALYTICS)
        }
    }, [setBreadcrumbs, handleUseResetMainWorkspaceComponent])

    const WorkspaceMainContent = useCallback(() => {
        switch (formTemplate) {
            case FormTemplateEnum.COLLECTIONS: return (<><CollectionsForm refetch={refetch} /></>)
            case FormTemplateEnum.ENDPOINTS: return (<EndpointsForm />)
            default: return (<Analytics />)
        }
    }, [formTemplate, refetch])

    return (
        <AccountLayout>
            <DeleteCollectionModal refId="delete-collection-modal" refetch={refetch} workspaceId={workspace?.id || ''} />
            <div className="card p-6">
                <div className="flex gap-4 flex-col lg:flex-row min-h-[450px]">
                    <aside className="w-full lg:w-64 shadow-lg py-2 px-3 border border-secondary/50 rounded-md">
                        {isLoading && !workspace ? <AsideSkeleton /> :
                            <>
                                <div className="px-3 py-2 font-bold text-lg truncate cursor-pointer" onClick={() => dispatch(setWorkspaceFormTemplate(FormTemplateEnum.ANALYTICS))}>
                                    {workspace?.name}
                                </div>
                                <div className="accordion-treeview-root" role="tree" aria-orientation="vertical">
                                    <div className="accordion" role="group" data-accordion-always-open>
                                        <TreeViewGroup refetch={refetch} sub={workspace?.collections} isError={isError} name={FormTemplateEnum.COLLECTIONS} ref="collections-tree-view" />
                                        <TreeViewGroup refetch={refetch} sub={workspace?.endpoints} isError={isError} name={FormTemplateEnum.ENDPOINTS} ref="endpoints-tree-view" />
                                    </div>
                                </div>
                            </>
                        }
                    </aside>

                    <main className="flex-1 shadow-lg border border-secondary/50 rounded-md overflow-auto min-h-90">
                        {WorkspaceMainContent()}
                    </main>
                </div>
            </div>
        </AccountLayout >
    )
}