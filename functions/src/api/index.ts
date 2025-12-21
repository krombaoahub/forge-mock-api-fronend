import { app as ExpressApi } from '../imports'
// import { app as endpointApi } from './endpoints'
import { app as workspaceApi } from './workspace'
import { app as collectionApi } from './collections'

const appApi = [workspaceApi, collectionApi]

let tempApp: typeof ExpressApi | null = null
let appAPI: typeof ExpressApi

appApi.forEach(api => {
    if (tempApp) {
        appAPI = tempApp
    }
    appAPI = api
    tempApp = appAPI
});

export { appAPI }