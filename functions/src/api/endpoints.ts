import { DocumentData } from 'firebase-admin/firestore';
import { app, db } from '../imports.js'
import { validateApiKey } from '../middleware.js';

// ## Create (POST)
app.post("/v1/d/:workspaceId/:endpoint", validateApiKey, async (req, res) => {
    const workspaceId = req.params.workspaceId;
    const endpoint = req.params.endpoint;
    res.status(200).json({ method: 'Create (POST)', endpoint, workspaceId });
    //   try {
    //     const newItem = req.body;
    //     const docRef = await db.collection("items").add(newItem);
    //     res.status(201).json({ id: docRef.id, ...newItem });
    //   } catch (error) {
    //     res.status(500).send(error);
    //   }
});

// ## Read ALL (GET)
app.get("/v1/d/:workspaceId/:endpoint", validateApiKey, async (req, res) => {
    // const workspaceId = req.params.workspaceId;
    const endpoint = req.params.endpoint;
    try {

        const docRef = db.collection(endpoint);
        const snapshot = await docRef.get()

        if (snapshot.empty) {
            res.status(404).send('Endpoint not found')
            return
        }
        const products: DocumentData[] = [];
        snapshot.forEach(doc => {
            products.push({ id: doc.id, ...doc.data() });
        });

        // --- Key Step: Set Cache-Control Headers ---
        // This tells the CDN (s-maxage) to cache the response for 10 minutes
        // and the browser (max-age) to cache it for 5 minutes.
        res.set('Cache-Control', 'public, max-age=300, s-maxage=600');

        // Send the data
        res.status(200).json(products);
    } catch (error) {
        res.status(500).send(error);
    }
    // res.status(200).json({ method: 'Read ALL (GET)', endpoint ,workspaceId});
});

// ## Read ALL (GET by ID)
app.get("/v1/d/:workspaceId/:endpoint/:id", validateApiKey, async (req, res) => {
    const workspaceId = req.params.workspaceId;
    const itemId = req.params.id;
    const endpoint = req.params.endpoint;
    try {

        const docRef = db.collection(endpoint);
        const snapshot = await docRef.doc(itemId).get()

        if (!snapshot.exists) {
            res.set('Cache-Control', 'no-store');
            res.status(404).send('Endpoint not found')
            return
        }
        const products: DocumentData = { id: snapshot.id, ...snapshot.data() };

        // --- Key Step: Set Cache-Control Headers ---
        // This tells the CDN (s-maxage) to cache the response for 10 minutes
        // and the browser (max-age) to cache it for 5 minutes.
        res.set('Cache-Control', 'public, max-age=300, s-maxage=600');

        // Send the data
        res.status(200).json(products);
    } catch (error) {
        res.status(500).send(error);
    }

    res.status(200).json({ method: 'Read ALL (GET by ID)', endpoint, itemId, workspaceId });
});

// ## Update (PUT)
app.put("/v1/d/:workspaceId/:endpoint/:id", async (req, res) => {
    const workspaceId = req.params.workspaceId;
    const itemId = req.params.id;
    const endpoint = req.params.endpoint;
    res.status(200).json({ method: 'Update (PUT)', endpoint, itemId, workspaceId });
    //   try {
    //     await db.collection("items").doc(itemId).update(req.body);
    //     res.status(200).send(`Item ${itemId} updated`);
    //   } catch (error) {
    //     res.status(500).send(error);
    //   }
});

// ## Delete (DELETE)
app.delete("/v1/d/:workspaceId/:endpoint/:id", async (req, res) => {
    const workspaceId = req.params.workspaceId;
    const itemId = req.params.id;
    const endpoint = req.params.endpoint;
    res.status(200).json({ method: 'Delete (DELETE)', endpoint, itemId, workspaceId });
    //   try {
    //     await db.collection("items").doc(itemId).delete();
    //     res.status(200).send(`Item ${itemId} deleted`);
    //   } catch (error) {
    //     res.status(500).send(error);
    //   }
});

export { app }