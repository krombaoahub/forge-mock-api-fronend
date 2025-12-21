import { FormTemplateEnum } from "@/enums";
import { useResetMainWorkspaceComponent } from "@/hooks/use-workspace";
import type { DeleteCollectionModalInterface } from "@/interfaces";
import { getBySelector } from "@/libs/domUtils";
import { useDeleteCollectionMutation } from "@/services/api";

const DeleteCollectionModal: React.FC<DeleteCollectionModalInterface> = ({ workspaceId, refId, refetch }) => {

    const [deleteCollection, { isLoading }] = useDeleteCollectionMutation()
    const handleUseResetMainWorkspaceComponent = useResetMainWorkspaceComponent()

    const onDeleteCollection = async () => {
        try {

            const collectionId = getBySelector('#delete-collection-modal input#collection_id') as HTMLInputElement
            const closeButton = getBySelector('#delete-collection-modal button[aria-label="Close"]') as HTMLButtonElement
            if (collectionId) {
                await deleteCollection({ workspaceId, collectionId: collectionId.value }).unwrap()
                setTimeout(() => {
                    refetch()
                    handleUseResetMainWorkspaceComponent(FormTemplateEnum.ANALYTICS)
                    if (closeButton) closeButton.click()
                }, 100);
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
                        <input type="hidden" id="collection_id" />
                        <h3 className="modal-title">Delete Collection <span id="collection_name"></span></h3>
                        <button type="button" className="btn btn-text btn-circle btn-sm absolute end-3 top-3" aria-label="Close" data-overlay={`#${refId}`}><span className="icon-[tabler--x] size-4"></span></button>
                    </div>
                    <div className="modal-body">
                        <p>Are you sure you want to delete this collection</p>
                        <small className="text-warning italic">note: endpoint that use this data will also be deleted.</small>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-overlay={`#${refId}`}>Cancel</button>
                        <button onClick={onDeleteCollection} type="submit" className={`btn btn-primary ${isLoading ? 'btn-disabled' : ''}`}>
                            {isLoading && <span className="loading loading-spinner"></span>}
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>)
}

export default DeleteCollectionModal;