import { WORKSPACE_ROUTE } from "@/contants/route"
import { getByAttribute, getBySelector } from "@/libs/domUtils"
import { TableFillMissingPage, TablePageInfo, TablePaginate, TableSearch } from "@/libs/table"
import { useDeleteWorkspaceMutation } from "@/services/api"
import type { DocumentData } from "firebase/firestore"
import { HSDropdown } from "flyonui/flyonui"
import { Plus, Trash } from "lucide-react"
import { useCallback, useEffect, useMemo, useRef, useState, type BaseSyntheticEvent } from "react"
import { useNavigate } from "react-router-dom"

interface UserWorkspaceTableInterface {
    data: DocumentData[]
    refetch: () => void
    isLoading: boolean
}

const UserWorkspaceTable: React.FC<UserWorkspaceTableInterface> = ({ data, refetch }) => {
    const maxVisibleButtons = 3;
    const itemsPerPage = 10; // Number of items to display per page    
    const navigate = useNavigate()

    const [deleteWorkspace, { isLoading: deleteLoading }] = useDeleteWorkspaceMutation()

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemLength, setItemLength] = useState<number>(data.length);
    const [buttonPages, setButtonPages] = useState<{ startPage: number, endPage: number }>({ startPage: 1, endPage: 3 });
    const [itemsToDisplay, setItemsToDisplay] = useState<DocumentData[]>(data.slice(0, itemsPerPage))

    const searchRef = useRef<HTMLInputElement>(null);

    const totalPages = useMemo(() => Math.ceil(itemLength / itemsPerPage), [itemLength]);

    const onDelete = useCallback(async (item: DocumentData) => {
        console.log(item)
        await deleteWorkspace(item).unwrap()
        // deleteWorkspace(item.uid)
        //     .then(isDeleted => {
        //         isDeleted && handleGetWorkspace()
        //     })
        refetch()
    }, [])

    useEffect(() => {
        setItemLength(data.length)
        setItemsToDisplay(data.slice(0, itemsPerPage))
    }, [data])

    useEffect(() => {
        setTimeout(() => {
            HSDropdown.autoInit()
        }, 1000);
    }, [])

    useEffect(() => {
        let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

        if (totalPages < endPage) { endPage = totalPages }
        setButtonPages({ startPage, endPage });
    }, [totalPages, currentPage])

    const fillMissingPage = useCallback((start: number, end: number) => {
        return TableFillMissingPage(start, end)
    }, [buttonPages])

    const paginate = useCallback((pageNumber: number = 1) => {
        TablePaginate({ itemsPerPage, pageNumber, searchRef, data, setCurrentPage, setItemLength, setItemsToDisplay })
    }, [data]);

    const search = useCallback((e: BaseSyntheticEvent) => {
        TableSearch({ e, itemsPerPage, data, setCurrentPage, setItemsToDisplay, setItemLength })
    }, [searchRef.current?.value]);

    const pageInfo = useCallback(() => {
        return TablePageInfo({ currentPage, itemLength, itemsPerPage })
    }, [currentPage, searchRef.current?.value])


    const onDeleteWorkspaceModal = (item: DocumentData) => {
        const modalBtn = getByAttribute('data-modal-btn', '#delete-workspace', document)
        const workspaceName = getBySelector('#delete-workspace span#workspace_name') as HTMLSpanElement
        const workspaceId = getBySelector('#delete-workspace input#workspace_id') as HTMLInputElement
        if(workspaceName) workspaceName.innerHTML = `'${item.name}'`
        if(workspaceId) workspaceId.value = item.id
        modalBtn && modalBtn.click()
    }

    const onCreateWorkspaceModal = () => {
        const modalBtn = getByAttribute('data-modal-btn', '#create-workspace', document)
        modalBtn && modalBtn.click()
    }

    return (
        <>
            {<div className="w-full overflow-x-auto ">
                <table className="table bg-secondary/5 rounded-md p-6">
                    <caption className="flex  justify-between border-b border-secondary/20 text-base-content p-5 text-left text-lg font-semibold rtl:text-right">
                        <div className="flex gap-2 items-center">
                            <span>Workspaces</span>
                            <div onClick={onCreateWorkspaceModal}>
                                <div className="btn btn-primary size-8 p-0">
                                    <Plus size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center sm:justify-between my-2">
                            <div className="input max-w-xs">
                                <span className="icon-[tabler--search] text-base-content/80 my-auto me-3 size-5 shrink-0"></span>
                                <input ref={searchRef} onInput={search} type="search" className="grow" placeholder="Search" />
                            </div>
                        </div>
                    </caption>

                    <tbody>
                        {
                            itemsToDisplay && itemsToDisplay.map((item: DocumentData, key: number) => (
                                <tr className="cursor-pointer row-hover" key={key}>
                                    <td className="flex justify-between items-center">
                                        <div className="size-full p-1" onClick={() => navigate(`${WORKSPACE_ROUTE}${item.id}`)}>{item.name}</div>
                                        <div>
                                            <div className="dropdown relative inline-flex">
                                                <button id="dropdown-avatar" type="button" className="p-0 border-0 dropdown-toggle flex items-center gap-2 rounded-full" aria-haspopup="menu" aria-expanded="false" aria-label="Dropdown">
                                                    <div className="btn btn-circle btn-text btn-sm" aria-label="Action button"><span className="icon-[tabler--dots-vertical] size-5"></span></div>
                                                </button>
                                                <ul className="dropdown-menu dropdown-open:opacity-100 hidden bg-transparent shadow-none min-w-20 max-w-65" role="menu" aria-orientation="vertical" aria-labelledby="dropdown-avatar">
                                                    <li className="p-3 flex items-center gap-2 btn btn-soft" onClick={() => { onDeleteWorkspaceModal(item) }}>
                                                        <Trash size={16} /> <div>Delete</div>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>

                {totalPages ? <div className="flex flex-wrap items-center justify-between gap-2 py-4 pt-6">
                    {pageInfo()}
                    <nav className="join">
                        {currentPage != 1 && <button onClick={() => paginate(currentPage - 1)} type="button" className="btn btn-soft btn-square join-item" aria-label="previous button">
                            <span className="icon-[tabler--chevron-left] size-5 rtl:rotate-180"></span>
                        </button>}
                        {
                            totalPages > 1 && fillMissingPage(buttonPages.startPage, buttonPages.endPage).map((page: number, key: number) => {
                                let pageNumber = Number(page);
                                return (
                                    <div key={key}>
                                        <button onClick={() => paginate(pageNumber)} type="button" className={`btn btn-soft join-item btn-square ${currentPage == pageNumber ? 'text-bg-primary' : ''}`}>{pageNumber}</button>
                                    </div>
                                )
                            })
                        }
                        {currentPage != totalPages &&
                            <button onClick={() => paginate(currentPage + 1)} type="button" className="btn btn-soft btn-square join-item" aria-label="next button">
                                <span className="icon-[tabler--chevron-right] size-5 rtl:rotate-180"></span>
                            </button>}
                    </nav>
                </div> : <div className="flex justify-center w-full text-base-content/80 bg-secondary/5 p-6 items-center text-center">No Results Found</div>}
            </div>
            }
        </>
    )
}

export default UserWorkspaceTable