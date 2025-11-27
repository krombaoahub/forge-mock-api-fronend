import { Request, Response, NextFunction } from 'express';
import { admin, db } from './imports';
// import { WORKSPACE } from './constant/collections';
import { DocumentReference } from 'firebase-admin/firestore';
import { WORKSPACE } from './constant/collections';
import { decryptWithSalt } from './lib/utils';

export interface AuthRequest extends Request {
    authId?: string;
    workspacesRef?: DocumentReference;
    payload?: any;
}

export const validateAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {

    const authorizationHeader = req.headers.authorization;

    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        const idToken = authorizationHeader.split('Bearer ')[1];

        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            req.authId = decodedToken.uid

            // Token is valid; proceed with function logic
            return next();
        } catch (error) {
            // Token is invalid/expired
            return res.status(403).send('Unauthorized: Invalid token');
        }
    } else {
        return res.status(403).send('Unauthorized: No token provided');
    }
};

export const validateWorkspaceOwner = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const workspaceId = req.params.workspaceId;
    const userId = req.authId;
    console.log({ workspaceId, userId })

    const docRef = db.collection(WORKSPACE);
    const workspacesRef = await docRef.doc(workspaceId)
    const workspacesSnapshot = await workspacesRef.get()

    if (!workspacesSnapshot.exists) {
        return res.status(404).send({ msg: `workspaces not exists` })
    }

    // check if the workspace is belong to the user accessing it
    const workspaceData = workspacesSnapshot.data();
    if (!workspaceData || workspaceData.ownerId !== userId) {
        return res.status(404).send({ msg: `workspace is not yours` })
    }

    req.workspacesRef = workspacesRef

    return next()
};

export const decryptPayloadData = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const salt = req.headers['x-g-salt'] as string
    const payload = decryptWithSalt(req.body.data, salt);
    req.payload = payload

    return next()
};

export const validateApiKey = async (req: Request, res: Response, next: NextFunction) => {
    // Best practice is to use a header like 'x-api-key' or 'Authorization'
    // const apiKey = req.headers['x-api-key'];

    // if (!apiKey) {
    //     return res.status(401).json({
    //         error: 'Unauthorized',
    //         message: 'API key is missing.'
    //     });
    // }

    // In a real application, you would query a database
    // and use a secure comparison method (e.g., hashed key lookup).
    // const isValid = apiKeys.includes(apiKey);
    const isValid = true

    if (isValid) {
        return next();
    } else {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid API key.'
        });
    }
};