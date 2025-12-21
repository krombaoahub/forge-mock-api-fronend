import { DocumentData } from 'firebase-admin/firestore';
import { app, db } from '../imports.js'
import { AuthRequest, validateAuth, validateWorkspaceOwner, decryptPayloadData } from '../middleware.js';
import { generateFakeData, timestamp, utf8ToBase64 } from '../lib/utils.js';
import { Response } from 'express';
import { DATA } from '../constant/collections.js';
import { isDeepStrictEqual } from 'util';
import { workspaceCollectionRefSnapshot } from '../lib/no-sql-utls.js';

// ####### (POST) #######

app.post("/v1/collection", [validateAuth, decryptPayloadData], async (req: AuthRequest, res: Response) => {
    const userId = req.authId;
    const payload = req.payload;
    try {
        if (payload) {

            const refSnapshot = await workspaceCollectionRefSnapshot(res, { id: payload.workspaceId, collections: { with: true } });
            const docRef = refSnapshot.ref as FirebaseFirestore.CollectionReference

            delete payload.workspaceId

            let docId = payload.id || 'non-existing-id'
            delete payload.id

            const check = docRef.doc(docId).get()

            const isEmpty = (await check).exists === false
            let savedCollectionData: DocumentData | undefined = {}
            let data: DocumentData = {}

            if (isEmpty) {
                const batch = db.batch();
                data = { ownerId: userId, ...payload, ...timestamp }
                savedCollectionData = await docRef.add(data)
                docId = savedCollectionData.id
                await batch.commit();
            } else {
                if ((await check).exists) {
                    delete payload.id
                    data = { ownerId: userId, ...payload, updatedAt: timestamp.updatedAt }
                    savedCollectionData = (await docRef.doc(docId).get()).data()
                    await docRef.doc(docId).update(data);
                }
            }

            const hasChanged = !isDeepStrictEqual(savedCollectionData?.schemaFields, payload.schemaFields) || payload.dataCount !== savedCollectionData?.dataCount

            if (isEmpty || hasChanged) {
                const batch = db.batch();
                const collectionData = docRef.doc(docId).collection(DATA)
                const generatedSchemaData = generateFakeData(payload.schemaFields, payload.dataCount)

                if (hasChanged) {
                    const existingDataSnapshot = await collectionData.get()
                    existingDataSnapshot.forEach((doc) => {
                        batch.delete(doc.ref);
                    });
                }

                await generatedSchemaData.forEach((item: DocumentData) => {
                    batch.set(collectionData.doc(), {
                        ...item,
                        ...timestamp
                    });
                });

                await batch.commit();
            }
            res.status(201).json({ id: docId, ...data }) // change this to standard return preview
        }
        else {
            res.status(500).send({ message: 'no payload found' });
        }
    } catch (error) {
        console.log({ error })
        res.status(500).send(error);
    }
});

// ####### (GET) #######
/**
 * get collection by workspace id and collection id
 */
app.get("/v1/collection/:workspaceId/:collectionId", [validateAuth, validateWorkspaceOwner], async (req: AuthRequest, res: Response) => {
    const workspaceId = req.params.workspaceId;
    const collectionId = req.params.collectionId
    try {

        const snapshot = await workspaceCollectionRefSnapshot(res, { id: workspaceId, collections: { id: collectionId } })
        const snapshotData = await workspaceCollectionRefSnapshot(res, { id: workspaceId, collections: { id: collectionId, data: { with: true } } })

        const data: DocumentData = { ...snapshot.data, data: snapshotData.data };

        // Send the data
        res.status(200).json(utf8ToBase64(JSON.stringify(data)));
    } catch (error) {
        console.log({ error })
        res.status(500).send(error);
    }
});
/**
 * get collection data by workspace id and collection id
 */
app.get("/v1/collection-data/:workspaceId/:collectionId", [validateAuth, validateWorkspaceOwner], async (req: AuthRequest, res: Response) => {
    const workspaceId = req.params.workspaceId;
    const collectionId = req.params.collectionId;
    try {

        const refSnapshot = await workspaceCollectionRefSnapshot(res, { id: workspaceId, collections: { id: collectionId, data: { with: true } } });

        // Send the data
        res.status(200).json(utf8ToBase64(JSON.stringify(refSnapshot.data)));
    } catch (error) {
        console.log({ error })
        res.status(500).send(error);
    }
});
/**
 * get collection by workspace id and collection id
 */
app.get("/v1/collections/:workspaceId", [validateAuth, validateWorkspaceOwner], async (req: AuthRequest, res: Response) => {
    const workspaceId = req.params.workspaceId;
    try {
        const refSnapshot = await workspaceCollectionRefSnapshot(res, { id: workspaceId, collections: { with: true } });

        if (!refSnapshot.data) res.status(404).json({ msg: `/v1/collections/:workspaceId response null` });

        // parse snapshot here
        const data = refSnapshot.data?.map((doc: DocumentData) => { return { id: doc.id, ...doc } })
        //

        res.status(200).json(utf8ToBase64(JSON.stringify(data)));
    } catch (error) {
        console.log({ error })
        res.status(500).send(error);
    }
});

// ####### (DELETE) #######
// collections
/**
 * delete collection
 */
app.delete("/v1/collection/:workspaceId/:collectionId", [validateAuth, validateWorkspaceOwner], async (req: AuthRequest, res: Response) => {
    const workspaceId = req.params.workspaceId;
    const collectionId = req.params.collectionId;
    try {
        const refSnapshot = await workspaceCollectionRefSnapshot(res, { id: workspaceId, collections: { id: collectionId } });
        const docRef = refSnapshot.ref as FirebaseFirestore.DocumentReference
        await docRef.delete();
        res.status(200).send({ success: true, message: `Item collectionId:${collectionId} deleted` });
    } catch (error) {
        console.log({ error })
        res.status(500).send(error);
    }
});


export { app }