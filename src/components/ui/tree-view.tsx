import { useGetCollection } from "@/hooks/use-workspace";
import type { SubTreeInterface, TreeViewGroupBtnInterface, TreeViewGroupInterface } from "@/interfaces";
import { useAppDispatch } from "@/states/hooks";
import { resetCollection, setLoading } from "@/states/slice/collection-slice";
import { setWorkspaceFormTemplate } from "@/states/slice/workspace-slice";
import { HSSelect } from "flyonui/flyonui";
import { useCallback, useRef } from "react";
import { useParams } from "react-router-dom";

export const TreeViewGroup: React.FC<TreeViewGroupInterface> = ({ sub, name, ref, isError }) => {
    return (
        <div className="accordion-item active" role="treeitem" aria-expanded="true" id={ref}>
            <TreeViewGroupBtn nameType={name} ref={ref} />
            <div id="basic-tree-collapse-one" className="accordion-content w-full overflow-hidden transition-[height] duration-300" aria-labelledby={ref} role="group" >
                <div className="tree-view-space" role="group" data-accordion-always-open>
                    {
                        <>
                            {!isError && sub.length > 0 ? sub.map((item, index) => (
                                <TreeViewItem key={index} name={item.name} id={item.id} type={name} />
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
    const dispatch = useAppDispatch()
    const handleUseGetCollection = useGetCollection()

    const onHandleNewFormFields = useCallback(() => {
        handleUseGetCollection(nameType, '', '')
        dispatch(resetCollection())
        dispatch(setWorkspaceFormTemplate(nameType))
        dispatch(setLoading(true))
        setTimeout(() => { dispatch(setLoading(false)) }, 10);
        setTimeout(() => { HSSelect.autoInit() }, 10);
    }, [nameType])

    return (
        <div className="accordion-heading flex w-full items-center gap-x-0.5 px-4 py-0.5">
            <button ref={collapseId} className="accordion-toggle btn btn-sm btn-circle btn-text" aria-label="Expand Button" aria-expanded={true} aria-controls={ref} >
                <span className="icon-[tabler--chevron-right] text-base-content/80 accordion-item-active:rotate-90 size-4 transition-all duration-300" ></span>
            </button>
            <div className="accordion-selectable accordion-selected:bg-base-300/40 grow cursor-pointer rounded-md px-1.5 group flex justify-between">
                <div className="flex items-center gap-x-3">
                    <span className="icon-[tabler--folder] text-base-content size-4 shrink-0"></span>
                    <div className="grow" onClick={() => collapseId.current?.click()}>
                        <span className="text-base-content">{nameType}</span>
                    </div>
                </div>
                <div className="flex">
                    <button className="group-hover:flex hidden accordion-toggle btn btn-sm btn-circle btn-text" onClick={onHandleNewFormFields}>
                        <span className="icon-[tabler--plus] text-base-content/80 size-4" ></span>
                    </button>
                </div>
            </div>
        </div>
    )
}

export const TreeViewItem: React.FC<SubTreeInterface> = ({ name, id, type }) => {
    const { workspaceId } = useParams()
    const handleUseGetCollection = useGetCollection()

    const onHandleGetCollectionById = useCallback(async () => {
        if (workspaceId) {
            handleUseGetCollection(type, workspaceId, id)
        }
    }, [id])

    return (
        <div className="accordion-selectable accordion-selected:bg-base-300/40 cursor-pointer rounded-md px-2" role="treeitem" onClick={onHandleGetCollectionById}>
            <div className="flex items-center gap-x-3">
                <span className="icon-[tabler--file] text-base-content size-4 shrink-0"></span>
                <div className="grow">
                    <span className="text-base-content">{name}</span>
                </div>
            </div>
        </div>
    )
}