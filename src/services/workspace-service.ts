import { COLLECTIONS, WORKSPACE } from "@/contants/collections";
import { db } from "@/firebase";
import { batchCommit, timestamp, timestampToMillis } from "@/libs/utils";
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, serverTimestamp, updateDoc, where, writeBatch, type DocumentData } from "firebase/firestore";
// import { useGetCollectionFieldsQuery } from "./api";

export async function createWorkspace(uuid: string, name: string) {
    const workspaceRef = collection(db, WORKSPACE);
    return await addDoc(workspaceRef, {
        name: name,
        ownerId: uuid,
        ...timestamp
    });

}

export async function getWorkspaceByUserId(uuid: string): Promise<DocumentData[]> {
    const workspaceRef = collection(db, WORKSPACE);
    const q = query(
        workspaceRef,
        where("ownerId", "==", uuid)
    );

    const querySnap = await getDocs(q);

    if (!querySnap.empty) {
        return querySnap.docs.map(e => {
            const data = e.data()
            data.createdAt = data.createdAt.toMillis()
            return {
                uid: e.id,
                ...data
            }
        })
    } else {
        //console.log("No such document!");
        return [];
    }
}

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

// WORKSPACE COLLECTION
interface CollectionDataInterface {
    id: string
    name: string
    createdAt: string
    deletedAt?: string
    updatedAt?: string
    sliderCount: number,
    schemeFields: { name: string, type: string }[]
}

export async function getCollectionById(workspaceId: string, collectionId: string) {
    try {
        if (collectionId) {
            const workspace = doc(db, WORKSPACE, workspaceId)
            const collections = collection(workspace, COLLECTIONS)
            const collectionRef = doc(collections, collectionId)

            const querySnap = (await getDoc(collectionRef))
            const data = querySnap.data();
            const collectionData = { ...data, id: querySnap.id, ...timestampToMillis(querySnap) } as CollectionDataInterface

            const subCollection = collection(collectionRef, collectionData.name)
            const subCollectionQuery = (await getDocs(subCollection))
            const subCollectionData = subCollectionQuery.docs.map((e: DocumentData) => { return { id: e.id, ...e.data(), ...timestampToMillis(e) } })
            console.log()
            return { ...collectionData, data: subCollectionData }
        }
    } catch (e) {
        console.error("Error getCollectionById: ", e);
    }
}

export async function getCollections(workspaceId: string) {
    try {
        const workspace = doc(db, WORKSPACE, workspaceId)
        const workspaceCollection = collection(workspace, COLLECTIONS)
        const querySnap = (await getDocs(workspaceCollection))

        return querySnap.docs.map((e) => {
            return {
                id: e.id, ...e.data(),
                ...timestampToMillis(e)
            }
        }).sort((a, b) => a.createdAt - b.createdAt)
    } catch (e) {
        console.error("Error getCollections: ", e);
    }
}

export interface CreateCollectionInterface {
    collectionId?: string
    workspaceId: string
    collectionName: string
    sliderCount: number,
    schemeFields: { name: string, type: string }[]
    data: DocumentData[]
}

export async function createCollection(props: CreateCollectionInterface): Promise<string> {
    try {
        const batch = writeBatch(db)
        const workspace = doc(db, WORKSPACE, props.workspaceId)
        const workspaceCollection = collection(workspace, COLLECTIONS)

        const q = query(
            workspaceCollection,
            where("name", "==", props.collectionName)
        );

        const querySnap = await getDocs(q);

        if (querySnap.empty) {
            const collectionData = await addDoc(workspaceCollection, {
                name: props.collectionName,
                sliderCount: props.sliderCount,
                schemeFields: props.schemeFields,
                ...timestamp
            });

            const workspaceCollectionDoc = collection(doc(workspaceCollection, collectionData.id), 'data')

            props.data.forEach((item: any) => {
                const docRef = doc(workspaceCollectionDoc);
                batch.set(docRef, {
                    ...item,
                    ...timestamp
                });
            });

            batchCommit(batch)
            return collectionData.id
        }
        return ''
    } catch (e) {
        console.error("Error createCollection: ", e);
        return ''
    }
}

export async function updateCollection({ workspaceId, collectionId, collectionName, sliderCount, schemeFields, data }: CreateCollectionInterface) {
    try {

        const batch = writeBatch(db)
        if (collectionId) {
            const workspace = doc(db, WORKSPACE, workspaceId)
            const collections = collection(workspace, COLLECTIONS)
            const collectionRef = doc(collections, collectionId)

            const querySnap = (await getDoc(collectionRef))
            const qData = querySnap.data();

            const collectionData = { ...qData, id: querySnap.id, ...timestampToMillis(querySnap) } as CollectionDataInterface

            await updateDoc(collectionRef, {
                name: collectionName,
                sliderCount: sliderCount,
                schemeFields: schemeFields,
                updatedAt: serverTimestamp()
            })

            const subCollection = collection(collectionRef, collectionData.name)
            const subCollectionQuery = (await getDocs(subCollection))

            if (sliderCount != collectionData.sliderCount || !window._.isEqual(schemeFields, collectionData.schemeFields)) {
                subCollectionQuery.docs.forEach((doc) => {
                    batch.delete(doc.ref);
                });

                const workspaceCollectionDoc = collection(collectionRef, collectionName)
                data.forEach((item: any) => {
                    const docRef = doc(workspaceCollectionDoc);
                    batch.set(docRef, {
                        ...item,
                        ...timestamp
                    });
                });

                batchCommit(batch)
            }
        }
    } catch (e) {
        console.error("Error updateCollection: ", e);
    }
}

// api