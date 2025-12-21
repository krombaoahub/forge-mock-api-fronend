import type { DocumentData } from "firebase/firestore";
import type { BaseSyntheticEvent } from "react";
import type React from "react";


export const TableFillMissingPage = (start: number, end: number) => {
    const numbers = [];
    if (start > end) {
        [start, end] = [end, start]; // Swap values if they are out of order
    }

    for (let i = start; i <= end; i++) {
        numbers.push(i);
    }
    return numbers;
}

interface PaginateInterface {
    searchRef: React.RefObject<HTMLInputElement | null>,
    itemsPerPage: number,
    pageNumber: number,
    data: DocumentData[],
    setCurrentPage: (a: number) => void
    setItemLength: (a: number) => void
    setItemsToDisplay: (a: DocumentData[]) => void
}

export const TablePaginate = ({ itemsPerPage, pageNumber = 1, searchRef, data, setCurrentPage, setItemsToDisplay, setItemLength }: PaginateInterface) => {

    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const query = searchRef.current?.value.toLowerCase() || '';
    const items = TableGetItemsForPage(
        { query, data, itemsPerPage, setItemLength, setItemsToDisplay }
    );
    setCurrentPage(pageNumber);

    setItemsToDisplay(items.slice(startIndex, endIndex));

}

interface GetItemsForPageInterface {
    query: string,
    data: DocumentData[],
    itemsPerPage: number,
    setItemLength: (a: number) => void
    setItemsToDisplay: (a: DocumentData[]) => void
}
export const TableGetItemsForPage = ({ query, data, itemsPerPage, setItemLength, setItemsToDisplay }: GetItemsForPageInterface) => {
    setItemLength(data.length);

    if (query.trim() === '') {
        setItemsToDisplay(data.slice(0, itemsPerPage));
        return data
    }

    const filteredItems = data.filter((item: DocumentData) =>
        item.name.toLowerCase().includes(query)
    );
    setItemsToDisplay(filteredItems.slice(0, itemsPerPage));

    setItemLength(filteredItems.length);
    return filteredItems

}

interface SearchInterface {
    e: BaseSyntheticEvent,
    itemsPerPage: number,
    data: DocumentData[],
    setCurrentPage: (a: number) => void
    setItemLength: (a: number) => void
    setItemsToDisplay: (a: DocumentData[]) => void
}

export const TableSearch = ({ e, itemsPerPage, data, setCurrentPage, setItemsToDisplay, setItemLength }: SearchInterface) => {
    const query = e.target.value.toLowerCase();
    setCurrentPage(1); TableGetItemsForPage(
        { query, data, itemsPerPage, setItemLength, setItemsToDisplay }
    );
}

interface PageInfoInterface {
    currentPage: number, itemLength: number, itemsPerPage: number
}
export function TablePageInfo({ currentPage, itemLength, itemsPerPage }: PageInfoInterface) {
    const start = (((currentPage - 1) * itemsPerPage) + 1);
    let end = currentPage * (itemLength < itemsPerPage ? itemLength : itemsPerPage);
    if (end > itemLength) end = itemLength;

    return (
        <>
            <div className="me-2 max-w-sm text-sm text-base-content/80 sm:mb-0 gap-1 flex" >
                Showing
                <span className="font-semibold text-base-content/80" > {start} - {end} </span>
                of
                <span className="font-semibold" > {itemLength} </span>
                workspaces
            </div>
        </>)
}