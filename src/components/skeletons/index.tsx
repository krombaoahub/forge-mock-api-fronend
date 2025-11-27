import type React from "react"

export const UserWorkspaceTableSkeleton: React.FC = () => (
    <>
        <div className="gap-4 flex-col flex">
            <div className="flex justify-between w-full">
                <div className="flex gap-3 items-center">
                    <div className="skeleton skeleton-animated w-30 h-9 " />
                    <div className="skeleton skeleton-animated size-10 rounded-full " />
                </div>
                <div className="skeleton skeleton-animated w-65 h-9 " />
            </div>
            <div className="skeleton-striped p-6 w-full flex gap-3 flex-col">
                <div className="skeleton skeleton-animated w-full h-9 " />
                <div className="skeleton skeleton-animated w-full h-9 " />
                <div className="skeleton skeleton-animated w-full h-9 " />
                <div className="skeleton skeleton-animated w-full h-9 " />
                <div className="skeleton skeleton-animated w-full h-9 " />
                <div className="skeleton skeleton-animated w-full h-9 " />
                <div className="skeleton skeleton-animated w-full h-9 " />
                <div className="skeleton skeleton-animated w-full h-9 " />
                <div className="skeleton skeleton-animated w-full h-9 " />
                <div className="skeleton skeleton-animated w-full h-9 " />
            </div>
            <div className="flex justify-between items-center">
                <div className="skeleton skeleton-animated w-65 h-9 " />
                <div className="skeleton skeleton-animated w-65 h-9 " />
            </div>
        </div>
    </>
)

export const AsideSkeleton: React.FC = () => (<>
    <div className="skeleton skeleton-animated rounded-md px-2 h-8 my-2 mx-4 mb-4" />
    <div className="skeleton skeleton-animated rounded-md px-2 h-6 my-2 mx-4" />
    <div className="skeleton skeleton-animated rounded-md px-2 h-6 my-2 ms-8 me-4" />
    <div className="skeleton skeleton-animated rounded-md px-2 h-6 my-2 mx-4" />
    <div className="skeleton skeleton-animated rounded-md px-2 h-6 my-2 ms-8 me-4" />
</>)

export const CollectionFormSkeleton: React.FC = () => (
    <div className="p-6 flex flex-col gap-4">
        <div className="skeleton skeleton-animated h-9 w-34"/>
        <div className="skeleton skeleton-animated h-9 w-full"/>
        <div className="flex justify-between gap-4">
            <div className="skeleton skeleton-animated h-9 w-[50%]"/>
            <div className="skeleton skeleton-animated h-9 w-34"/>
        </div>
        <div className="skeleton skeleton-animated h-9 w-34"/>
        <div className="flex justify-between gap-4">
            <div className="skeleton skeleton-animated h-9 grow"/>
            <div className="skeleton skeleton-animated h-9 grow"/>
        </div>
        <div className="skeleton skeleton-animated h-9 w-34"/>
        <div className="skeleton-striped h-34 w-full"/>

    </div>
)