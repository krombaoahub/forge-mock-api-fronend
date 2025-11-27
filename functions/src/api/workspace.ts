import { DocumentData } from 'firebase-admin/firestore';
import { app, db } from '../imports.js'
import { AuthRequest, validateAuth, validateWorkspaceOwner, decryptPayloadData } from '../middleware.js';
import { decryptWithSalt, defaultRespose, generateFakeData, timestamp, timestampToMillis } from '../lib/utils.js';
import { Response } from 'express';
import { COLLECTIONS, DATA, WORKSPACE } from '../constant/collections.js';

// ####### (POST) #######
/**
 * create workspace
 */
app.post("/v1/workspace", validateAuth, async (req: AuthRequest, res: Response) => {
    const userId = req.authId;
    try {
        const salt = req.headers['x-g-salt'] as string
        const payload = decryptWithSalt(req.body.data, salt);
        const data = { ownerId: userId, ...payload, ...timestamp }
        const docRef = await db.collection(WORKSPACE).add(data);
        res.status(201).json({ id: docRef.id, ...data }) // change this to standard return preview
    } catch (error) {
        console.log({ error })
        res.status(500).send(error);
    }
});

app.post("/v1/collection", [validateAuth, decryptPayloadData], async (req: AuthRequest, res: Response) => {
    const userId = req.authId;
    const payload = req.payload;
    try {
        const docRef = await db.collection(WORKSPACE)
            .doc(payload.workspaceId).collection(COLLECTIONS);

        delete payload.workspaceId

        const data = { ownerId: userId, ...payload, ...timestamp }

        const check = docRef.where('name', '==', payload.name).get()

        const isEmpty = (await check).empty

        if (isEmpty) {
            const batch = db.batch();
            const savedCollectionData = await docRef.add(data)
            const collectionData = docRef.doc(savedCollectionData.id).collection(DATA)
            const generatedSchemeData = generateFakeData(payload.schemeFields, payload.dataCount)

            await generatedSchemeData.forEach((item: any) => {
                batch.set(collectionData.doc(), {
                    ...item,
                    ...timestamp
                });
            });

            await batch.commit();
        }

        res.status(201).json(data) // change this to standard return preview
    } catch (error) {
        console.log({ error })
        res.status(500).send(error);
    }
});
// ####### (GET) #######
/**
 * get workspaces by user id
 */
app.get("/v1/workspaces/:userId", validateAuth, async (req: AuthRequest, res: Response) => {
    const userId = req.authId;
    try {

        if (userId != req.params.userId) {
            res.status(403).send('Unauthorized: User');
            return
        }

        const docRef = db.collection(WORKSPACE);
        const workspacesSnapshot = await docRef.where("ownerId", '==', userId).get()

        if (workspacesSnapshot.empty) {
            res.status(404).send({ msg: `workspacesSnapshot empty` })
            return
        }

        const workspaces: DocumentData[] = [];

        workspacesSnapshot.forEach(doc => {
            workspaces.push(defaultRespose(doc));
        });

        // Send the data
        res.status(200).json(workspaces.sort((a, b) => a.createdAt - b.createdAt));
    } catch (error) {
        res.status(500).send(error);
    }
});
/**
 * get workspace by workspace id
 */
app.get("/v1/workspace/:workspaceId", [validateAuth, validateWorkspaceOwner], async (req: AuthRequest, res: Response) => {
    const workspaceId = req.params.workspaceId;
    const userId = req.authId;
    try {
        const docRef = db.collection(WORKSPACE);
        const workspaceDoc = await docRef.doc(workspaceId)

        const workspaceSnapshot = await workspaceDoc.get()

        if (!workspaceSnapshot.exists) {
            res.status(404).send({ msg: `workspaceSnapshot empty` })
            return
        }

        // check if the workspace is belong to the user accessing it
        const workspaceData = workspaceSnapshot.data();
        if (!workspaceData || workspaceData.ownerId !== userId) {
            res.status(404).send({ msg: `workspace is not yours` })
            return
        }

        const collections: DocumentData[] = [];
        const endpoints: DocumentData[] = [];

        const collectionsSnapshot = await workspaceDoc.collection('collections').get()

        collectionsSnapshot.forEach(doc => {
            collections.push(defaultRespose(doc));
        });

        const endpointsSnapshot = await workspaceDoc.collection('endpoints').get()

        endpointsSnapshot.forEach(doc => {
            endpoints.push(defaultRespose(doc));
        });

        // Send the data
        res.status(200).json({ ...defaultRespose(workspaceSnapshot), collections, endpoints });
    } catch (error) {
        res.status(500).send(error);
    }
});
/**
 * get collection by workspace id and collection id
 */
app.get("/v1/collection/:workspaceId/:collectionId", [validateAuth, validateWorkspaceOwner], async (req: AuthRequest, res: Response) => {
    const workspaceId = req.params.workspaceId;
    const collectionId = req.params.collectionId;
    const userId = req.authId;
    try {
        const docRef = db.collection(WORKSPACE);
        const workspacesRef = await docRef.doc(workspaceId)
        const workspacesSnapshot = await workspacesRef.get()

        if (!workspacesSnapshot.exists) {
            res.status(404).send({ msg: `workspacesSnapshot empty` })
            return
        }

        // check if the workspace is belong to the user accessing it
        const workspaceData = workspacesSnapshot.data();
        if (!workspaceData || workspaceData.ownerId !== userId) {
            res.status(404).send({ msg: `workspace is not yours` })
            return
        }

        const snapshot = await workspacesRef
            .collection('collections')
            .doc(collectionId)
            .get()

        if (!snapshot.exists) {
            res.status(404).send({})
            return
        }
        const data: DocumentData = { id: snapshot.id, ...snapshot.data(), ...timestampToMillis(snapshot) };

        // Send the data
        res.status(200).json(btoa(JSON.stringify(data)));
    } catch (error) {
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
        const docRef = db.collection(WORKSPACE);
        const snapshot = await docRef.doc(workspaceId)
            .collection('collections')
            .doc(collectionId)
            .collection('data')
            .get()

        if (snapshot.empty) {
            res.status(404).send([])
            return
        }
        const data: DocumentData[] = [];
        snapshot.forEach(doc => {
            data.push(defaultRespose(doc));
        });

        // Send the data
        res.status(200).json(data);
    } catch (error) {
        res.status(500).send(error);
    }
});

// ####### (DELETE) #######
// workspaces
/**
 * delete workspace
 */
app.delete("/v1/workspace/:workspaceId", [validateAuth, validateWorkspaceOwner, decryptPayloadData], async (req: AuthRequest, res: Response) => {
    const workspaceId = req.params.workspaceId;
    const userId = req.authId;
    try {
        const docRef = await db.collection(WORKSPACE).doc(workspaceId)
        const snapshot = await docRef.get()

        if (!snapshot.exists) {
            res.status(404).send({ msg: `Item ${workspaceId} not exists` })
            return
        }

        // check if the workspace is belong to the user accessing it
        const workspaceData = snapshot.data();
        if (!workspaceData || workspaceData.ownerId !== userId) {
            res.status(404).send({ msg: `workspace is not yours` })
            return
        }

        await docRef.delete();
        res.status(200).send({ success: true, message: `Item ${workspaceId} deleted` });
    } catch (error) {
        res.status(500).send(error);
    }
});


export { app }