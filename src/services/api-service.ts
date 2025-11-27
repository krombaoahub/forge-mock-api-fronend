import { fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react"
import { getAuth } from "firebase/auth";

export const BASEAPIURL = 'http://127.0.0.1:5001/apiforge-37f1d/us-central1'

export const auth = getAuth();

export const baseQuery = fetchBaseQuery({
    baseUrl: BASEAPIURL,
    prepareHeaders: async (headers) => {
        let token = ''

        auth.currentUser && await auth.currentUser.getIdToken(true)
            .then(function (idToken) {
                token = idToken
            })
            .catch(function (error) {
                console.log('auth.currentUser:', { error })
            });

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        headers.set('Content-Type', 'application/json');

        return headers;
    },
});

export const baseQueryWithRetry = retry(baseQuery, { maxRetries: 2 });
