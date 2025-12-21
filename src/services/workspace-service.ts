import { WORKSPACE } from "@/contants/collections";
import { db } from "@/firebase";
import { deleteDoc, doc } from "firebase/firestore";

// move to api
export async function deleteWorkspace(uuid: string): Promise<boolean> {
    if (!uuid) return false;

    const workspaceRef = doc(db, WORKSPACE, uuid);
    try {
        // Delete the document
        await deleteDoc(workspaceRef);
        //console.log("Document successfully deleted!");
        return true
    } catch (error) {
        console.error("Error removing document: ", error);
        return false
    }
}