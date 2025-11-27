import AppLogo from "@/components/logo";
import { AccountLayout } from "@/layouts/account-layout";
import { Search } from "lucide-react";
import { WorkspaceProvider } from "@/context/WorkspaceContext";
import CreateWorkspaceModal from "./create-workspace-modal"
import { getByAttribute } from "@/libs/domUtils";
import { useAppContext } from "@/context/AppContext";
import { useEffect } from "react";
import { useAppSelector } from "@/states/hooks";
import UserWorkspaceTable from "./workspace-table";
import { useGetWorkspacesQuery } from "@/services/api";
import { UserWorkspaceTableSkeleton } from "@/components/skeletons";
import DeleteWorkspaceModal from "./delete-workspace-modal";

export default function DashboardPage() {
    return (
        <WorkspaceProvider>
            <Dashboard />
        </WorkspaceProvider >
    )
}
export function Dashboard() {
    const currentUser = useAppSelector((state: any) => state.app.currentUser)
    const { setBreadcrumbs } = useAppContext();

    const { data, isLoading, isError, refetch } = useGetWorkspacesQuery(currentUser.localId)

    useEffect(() => {
        setBreadcrumbs([{ name: 'Dashboard', path: '/dashboard' }]);
    }, [])

    const onCreateWorkspaceModal = () => {
        const modalBtn = getByAttribute('data-modal-btn', '#create-workspace', document)
        modalBtn && modalBtn.click()
    }
    
    console.log({ data, isLoading, isError })
    return (
        <AccountLayout>
            <div className="card p-6">
                <DeleteWorkspaceModal refetch={refetch} dataCount={data ? data.length : 0} refId="delete-workspace" className="hidden" id={''} />
                <CreateWorkspaceModal refetch={refetch} dataCount={data ? data.length : 0} refId="create-workspace" className="hidden" />
                {isLoading ? <UserWorkspaceTableSkeleton /> :
                    <>
                        {!isError ? <UserWorkspaceTable refetch={refetch} data={data} isLoading={isLoading} />
                            : <div className="flex flex-col gap-4 justify-center min-h-[80dvh] items-center">
                                <p className="font-medium text-sm flex gap-2 items-center"><Search size={15} />No workspaces yet...</p>
                                <AppLogo logoOnly logoSize={70} className="[&>div]:size-60 [&>div]:btn [&>div]:btn-secondary [&>div]:bg-secondary/20 [&>div]:border-0 [&>div]:shadow-none [&>div]:rounded-full" />
                                <div onClick={onCreateWorkspaceModal}><div className="btn btn-secondary">Create new workspace</div></div>
                            </div>
                        }
                    </>
                }
            </div>
        </AccountLayout >
    )
}
