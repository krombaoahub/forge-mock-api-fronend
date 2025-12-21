import { CollectionsEnum } from "../enums";
import { db } from "../imports";
import { Response } from "express";
import { timestampToDate } from "./utils";
import { DocumentData } from "firebase-admin/firestore";

type FirebaseFirestoreDoc = FirebaseFirestore.DocumentSnapshot | FirebaseFirestore.QuerySnapshot
type FirebaseFirestoreSnapshotType = 'DocumentSnapshot' | 'QuerySnapshot'

interface WorkspaceCollections {
    id?: string
    ownerId?: string
    collections?: {
        with?: boolean
        id?: string
        data?: {
            with?: boolean
            id?: string
        }
    }
}

const getData = (res: Response, snapshot: FirebaseFirestoreDoc, type: FirebaseFirestoreSnapshotType, options: WorkspaceCollections = {}): object | object[] | null => {
    let data = null;
    if (type === 'DocumentSnapshot') {
        const tempSnapshot = snapshot as FirebaseFirestore.DocumentSnapshot
        if (!tempSnapshot.exists) {
            res.status(404).send({ msg: `DocumentSnapshot is empty: {${JSON.stringify(options)}}` })
            return null
        }
        data = { id: tempSnapshot.id, ...tempSnapshot.data(), ...timestampToDate(tempSnapshot) }

    } else {
        const tempSnapshot = snapshot as FirebaseFirestore.QuerySnapshot
        data = tempSnapshot.docs.map(doc => { return { id: doc.id, ...doc.data(), ...timestampToDate(doc) } })
        if (tempSnapshot.empty) {
            console.warn(`QuerySnapshot is empty: {${JSON.stringify(options)}}`)
            data = []
        }
    }

    return data
}

export const workspaceCollectionRefSnapshot = async (res: Response, options?: WorkspaceCollections): Promise<{ ref: FirebaseFirestore.CollectionReference | FirebaseFirestore.Query | FirebaseFirestore.DocumentReference | null, data: DocumentData | DocumentData[] | null }> => {
    try {
        const docRef = db.collection(CollectionsEnum.WORKSPACE);
        let tempRef = null;
        if (options) {
            const { id, ownerId, collections } = options

            if (ownerId) {
                tempRef = await docRef.where("ownerId", "==", ownerId)
            }

            if (id && !ownerId) {
                tempRef = await docRef.doc(id)

                if (collections && (collections.with || collections.id)) {
                    tempRef = await tempRef.collection(CollectionsEnum.COLLECTIONS)

                    if (collections.id) {
                        tempRef = await tempRef.doc(collections.id)

                        if (collections.data && (collections.data.with || collections.data.id)) {
                            tempRef = await tempRef.collection(CollectionsEnum.DATA)

                            if (collections.data.id) {
                                tempRef = await tempRef.doc(collections.data.id)
                            }
                        }
                    }
                }
            }
        } else {
            tempRef = docRef;
        }

        let data: object | object[] | null = null

        if (tempRef) {
            // Snapshot fetching
            const snapshot = await tempRef.get();

            if (!snapshot) {
                res.status(404).send({ msg: `workspace collection ref is empty` })
                return { ref: null, data: [] };
            }

            let type: FirebaseFirestoreSnapshotType = 'QuerySnapshot'

            if (options) {
                const { id, ownerId, collections } = options

                if (!id && (collections?.with || collections?.id)) {
                    res.status(500).send({ msg: `workspace id must be provided to use collections` })
                    return { ref: null, data: [] };
                }

                if (!collections?.id && (collections?.data?.with || collections?.data?.id)) {
                    res.status(500).send({ msg: `collections id must be provided to use data` })
                    return { ref: null, data: [] };
                }

                if (id) type = 'DocumentSnapshot'
                if ((collections && collections.with)) type = 'QuerySnapshot'
                if ((collections && collections.id)) type = 'DocumentSnapshot'
                if ((collections && collections.data && collections.data.with)) type = 'QuerySnapshot'
                if ((collections && collections.data && collections.data.id)) type = 'DocumentSnapshot'
                if (ownerId) type = 'QuerySnapshot'
            }

            data = getData(res, snapshot, type, options)
        }
        return { ref: tempRef, data };
    } catch (error) {
        console.log({ error })
        return { ref: null, data: [] };
    }
}