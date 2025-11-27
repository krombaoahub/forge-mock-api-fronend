import type React from "react";
import { useAppSelector } from "@/states/hooks";
import { collectionSelector } from "@/states/slice/selector/collection-selector";
import { CollectionFormSkeleton } from "@/components/skeletons";
import CollectionForm from "./form";

const CollectionsForm: React.FC<{ refetch: () => void }> = ({ refetch }) => {
    const { loading } = useAppSelector(collectionSelector)
    return (
        <div>
            {loading ? <CollectionFormSkeleton />
                : <div className="w-full relative flex flex-col gap-4 p-6 ">
                    <CollectionForm refetch={refetch} />
                </div>}
        </div>
    )
}

export default CollectionsForm;