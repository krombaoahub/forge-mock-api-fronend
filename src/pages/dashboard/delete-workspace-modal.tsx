import type { DeleteWorkspaceModalInterface } from "@/interfaces";
import { getBySelector } from "@/libs/domUtils";
import { destroyInitModal } from "@/libs/utils";
import { useDeleteWorkspaceMutation } from "@/services/api";
import { useEffect } from "react";

const DeleteWorkspaceModal: React.FC<DeleteWorkspaceModalInterface> = ({ children, refId, refetch, dataCount, id }) => {
    const query = getBySelector(`#${refId}`, document)

    const [deleteWorkspace, { isLoading: deleteLoading }] = useDeleteWorkspaceMutation()

    useEffect(() => {
        if (query) {
            destroyInitModal(query)
        }
    }, []);

    const onDeleteWorkspace = async () => {
        try {

            const workspaceId = getBySelector('#delete-workspace input#workspace_id') as HTMLInputElement
            if (workspaceId) {
                await deleteWorkspace({ id: workspaceId.value }).unwrap()

                if (dataCount == 0) {
                    window.location.reload()
                }

                if (query) {
                    setTimeout(() => {
                        refetch()
                    }, 100);
                    destroyInitModal(query)
                }
            }

        } catch (err) {
            console.error('Failed to delete the workspace:', err);
        }
    }

    return (
        <div>
            <div aria-haspopup="dialog" aria-expanded="false" data-overlay={`#${refId}`} data-modal-btn={`#${refId}`}>
                {children}
            </div>

            <div id={`${refId}`} className="overlay modal overlay-open:opacity-100 overlay-open:duration-300 modal-middle hidden" role="dialog" tabIndex={-1}>
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
                            <button type="button" className="btn btn-soft btn-secondary" data-overlay={`#${refId}`}>Cancel</button>
                            <button onClick={onDeleteWorkspace} type="submit" className={`btn btn-primary ${deleteLoading ? 'btn-disabled' : ''}`}>
                                {deleteLoading && <span className="loading loading-spinner"></span>}
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}

export default DeleteWorkspaceModal;