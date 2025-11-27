import { configureStore } from '@reduxjs/toolkit'
import workspaceReducer from '@/states/slice/workspace-slice'
import collectionReducer from '@/states/slice/collection-slice'
import appReducer from '@/states/slice/app-slice'
import { setupListeners } from '@reduxjs/toolkit/query'
import { workspaceApi } from '@/services/api'

export const store = configureStore({
  reducer: {
    app: appReducer,
    workspace: workspaceReducer,
    collection: collectionReducer,
    // api
    [workspaceApi.reducerPath]: workspaceApi.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['app/setCurrentUser'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['app.currentUser', 'meta.baseQueryMeta.request', 'meta.baseQueryMeta.response'],
        // Ignore these paths in the state
        ignoredPaths: ['app.currentUser', 'meta.baseQueryMeta.request', 'meta.baseQueryMeta.response'],
      },
    }).concat(workspaceApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch