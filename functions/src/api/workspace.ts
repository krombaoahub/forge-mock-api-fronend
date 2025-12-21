import { DocumentData } from 'firebase-admin/firestore';
import { app, db } from '../imports.js'
import { AuthRequest, validateAuth, validateWorkspaceOwner } from '../middleware.js';
import { decryptWithSalt, defaultRespose, timestamp, utf8ToBase64 } from '../lib/utils.js';
import { Response } from 'express';
import { WORKSPACE } from '../constant/collections.js';
import { workspaceCollectionRefSnapshot } from '../lib/no-sql-utls.js';

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


// ####### (GET) #######
/**
 * get workspaces by user id
 */
app.get("/v1/workspaces/:userId", validateAuth, async (req: AuthRequest, res: Response) => {
    const userId = req.authId;
    try {
        const workspaces: DocumentData[] = [];
        if (userId != req.params.userId) {
            res.status(403).send('Unauthorized: User');
            return
        }

        const docRef = db.collection(WORKSPACE);
        const workspacesSnapshot = await docRef.where("ownerId", '==', userId).get()

        if (workspacesSnapshot.empty) {
            res.status(404).send({ msg: `workspaceSnapshot empty` })
            return
        }

        workspacesSnapshot.forEach(doc => {
            workspaces.push(defaultRespose(doc));
        });

        // Send the data
        res.status(200).json(workspaces.sort((a, b) => a.createdAt - b.createdAt));
    } catch (error) {
        res.status(500).send({ error });
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
        res.status(200).json(utf8ToBase64(JSON.stringify({ ...defaultRespose(workspaceSnapshot), collections, endpoints })));
    } catch (error) {
        res.status(500).send(error);
    }
});
// ####### (DELETE) #######
// workspaces
/**
 * delete workspace
 */
app.delete("/v1/workspace/:workspaceId", [validateAuth, validateWorkspaceOwner], async (req: AuthRequest, res: Response) => {
    const workspaceId = req.params.workspaceId;
    try {
        const doc = await workspaceCollectionRefSnapshot(res, { id: workspaceId })
        const docRef = doc.ref as FirebaseFirestore.DocumentReference
        await docRef.delete();
        res.status(200).send({ success: true, message: `Item ${workspaceId} deleted` });
    } catch (error) {
        res.status(500).send(error);
    }
});


export { app }