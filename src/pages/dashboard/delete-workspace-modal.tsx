import type { DeleteWorkspaceModalInterface } from "@/interfaces";
import { getBySelector } from "@/libs/domUtils";
import { useDeleteWorkspaceMutation } from "@/services/api";

const DeleteWorkspaceModal: React.FC<DeleteWorkspaceModalInterface> = ({ refId, refetch }) => {

    const [deleteWorkspace, { isLoading: deleteLoading }] = useDeleteWorkspaceMutation()

    const onDeleteWorkspace = async () => {
        try {

            const workspaceId = getBySelector('#delete-workspace-modal input#workspace_id') as HTMLInputElement
            const closeButton = getBySelector('#delete-workspace-modal button[aria-label="Close"]') as HTMLButtonElement
            if (workspaceId) {
                await deleteWorkspace({ id: workspaceId.value }).unwrap().then(() => {
                    console.log('Workspace deleted successfully');
                    refetch()
                    if (closeButton) closeButton.click()
                })
            }

        } catch (err) {
            console.error('Failed to delete the workspace:', err);
        }
    }

    return (<>
        <button type="button" className="" aria-haspopup="dialog" aria-expanded="false"
            aria-controls={`${refId}`} data-modal-btn={`#${refId}`} data-overlay={`#${refId}`}></button>

        <div id={`${refId}`} className="overlay modal overlay-open:opacity-100 overlay-open:duration-300 modal-middle hidden" role="dialog" >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <input type="hidden" id="workspace_id" />
                        <h3 className="modal-title">Delete Workspace <span id="workspace_name"></span></h3>
                        <button type="button" className="btn btn-text btn-circle btn-sm absolute end-3 top-3" aria-label="Close" data-overlay={`#${refId}`}><span className="icon-[tabler--x] size-4"></span></button>
                    </div>
                    <div className="modal-body">
                        Are you sure you want to delete this workspace
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-overlay={`#${refId}`}>Cancel</button>
                        <button onClick={onDeleteWorkspace} type="submit" className={`btn btn-primary ${deleteLoading ? 'btn-disabled' : ''}`}>
                            {deleteLoading && <span className="loading loading-spinner"></span>}
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default DeleteWorkspaceModal;