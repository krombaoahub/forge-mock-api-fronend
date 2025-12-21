import { fetchBaseQuery, retry } from "@reduxjs/toolkit/query/react"
import { auth } from "@/firebase";

export const BASEAPIURL = 'http://127.0.0.1:5001/apiforge-37f1d/us-central1' // @TODO: move to env

export const baseQuery = fetchBaseQuery({
    baseUrl: BASEAPIURL,
    prepareHeaders: async (headers) => {
        let token = ''

        if (auth.currentUser) {
            await auth.currentUser.getIdToken(true)
                .then(function (idToken) {
                    token = idToken
                })
                .catch(function (error) {
                    console.log('auth.currentUser:', { error })
                });
        }

        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }

        headers.set('Content-Type', 'application/json');

        return headers;
    },
});

export const baseQueryWithRetry = retry(baseQuery, { maxRetries: 2 });
