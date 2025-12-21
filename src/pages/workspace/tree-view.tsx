import { useMainWorkspaceComponent, useResetMainWorkspaceComponent } from "@/hooks/use-workspace";
import type { SubTreeInterface, TreeViewGroupBtnInterface, TreeViewGroupInterface } from "@/interfaces";
import { getByAttribute, getBySelector } from "@/libs/domUtils";
// import { useDeleteCollectionMutation } from "@/services/api";
import { useCallback, useRef } from "react";
import { useParams } from "react-router-dom";

export const TreeViewGroup: React.FC<TreeViewGroupInterface> = ({ sub, name, ref, isError, refetch }) => {
    return (
        <div className="accordion-item active" role="treeitem" aria-expanded="true" id={ref}>
            <TreeViewGroupBtn nameType={name} ref={ref} />
            <div id="basic-tree-collapse-one" className="accordion-content w-full overflow-hidden transition-[height] duration-300" aria-labelledby={ref} role="group" >
                <div className="tree-view-space" role="group" data-accordion-always-open>
                    {
                        <>
                            {(!isError && sub && sub.length > 0) ? sub.map((item, index) => (
                                <TreeViewItem key={index} name={item.name} id={item.id} type={name} refetch={refetch} />
                            )) : <div>
                                <div className="text-sm"><small>This {name} is empty.</small></div>
                                <div className="text-sm"><small>Click the <span className="text-primary text-lg font-bold">+</span> button to add new items.</small></div>
                            </div>
                            }
                        </>
                    }
                </div>
            </div>
        </div>
    )
}
export const TreeViewGroupBtn: React.FC<TreeViewGroupBtnInterface> = ({ nameType, ref }) => {
    const collapseId = useRef<HTMLButtonElement>(null);
    const handleUseResetMainWorkspaceComponent = useResetMainWorkspaceComponent()

    const onHandleNewFormFields = useCallback(() => {
        handleUseResetMainWorkspaceComponent(nameType)
    }, [handleUseResetMainWorkspaceComponent, nameType])

    return (
        <div className="accordion-heading flex w-full items-center gap-x-0.5 px-4 py-0.5">
            <button ref={collapseId} className="accordion-toggle btn btn-sm btn-circle btn-text" aria-label="Expand Button" aria-expanded={true} aria-controls={ref} >
                <span className="icon-[tabler--chevron-right] text-base-content/80 accordion-item-active:rotate-90 size-4 transition-all duration-300" ></span>
            </button>
            <div className="accordion-selectable accordion-selected:bg-base-300/40 grow cursor-pointer rounded-md px-1.5 flex justify-between">
                <div className="flex items-center gap-x-3">
                    <span className="icon-[tabler--folder] text-base-content size-4 shrink-0"></span>
                    <div className="grow" onClick={() => collapseId.current?.click()}>
                        <span className="text-base-content">{nameType}</span>
                    </div>
                </div>
                <div className="flex">
                    <button className="accordion-toggle btn btn-sm btn-circle btn-text p-1" onClick={onHandleNewFormFields}>
                        <span className="icon-[tabler--plus] text-base-content/80 size-4" ></span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export const TreeViewItem: React.FC<SubTreeInterface> = ({ name, id, type }) => {
    const { workspaceId } = useParams()
    const onHandleComponentChange = useMainWorkspaceComponent()
    // const [deleteCollection, { isLoading }] = useDeleteCollectionMutation()
    // const handleUseResetMainWorkspaceComponent = useResetMainWorkspaceComponent()

    const onHandleGetCollectionById = useCallback(async () => {
        if (workspaceId) {
            onHandleComponentChange(type, workspaceId, id)
        }
    }, [id, onHandleComponentChange, type, workspaceId])

    const onDeleteCollection = useCallback(async () => {
        const modalBtn = getByAttribute('data-modal-btn', '#delete-collection-modal', document)
        const collectionName = getBySelector('#delete-collection-modal span#collection_name') as HTMLSpanElement
        const collectionId = getBySelector('#delete-collection-modal input#collection_id') as HTMLInputElement
        if (collectionName) collectionName.innerHTML = `'${name}'`
        if (collectionId) collectionId.value = id
        if (modalBtn) modalBtn.click()
    }, [id, name])


    return (
        <div className="group flex justify-between items-center-safe pe-2 hover:bg-base-200 rounded-md me-3 py-1" role="treeitem">
            <div className="accordion-selectable accordion-selected:bg-base-300/40 cursor-pointer rounded-md px-2" role="treeitem" onClick={onHandleGetCollectionById}>
                <div className="flex items-center gap-x-3">
                    <span className="icon-[tabler--file] text-base-content size-4 shrink-0"></span>
                    <div className="grow  flex justify-between">
                        <span className="text-base-content">{name}</span>
                    </div>
                </div>
            </div>
            <div className="flex">
                <button className="accordion-toggle btn btn-sm btn-circle btn-text p-1" onClick={onDeleteCollection}>
                    <span className="icon-[tabler--trash] text-base-content/80 size-4" ></span>
                </button>
            </div>
        </div>
    )
}