
import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import cors from "cors";
import express from "express";
import admin from "firebase-admin";


// import rateLimit from 'express-rate-limit';

// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100 // limit each IP to 100 requests per windowMs
// });

var serviceAccount = require("./service-key.json")
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  
});

const db = admin.firestore();

const app = express();

app.use(express.json());
app.use(cors({ origin: true }));
// app.use('/api/', limiter); // Apply to all /api/ routes
app.use((req, res, next) => {
  if (req.url.indexOf("/api/") === 0) {
    req.url = req.url.substring("/api".length);
    console.log(req.url)
  }
  next();
});

export { app, db, admin, logger, express, onRequest, setGlobalOptions };
