import {configureStore} from "@reduxjs/toolkit";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import {combineReducers} from 'redux';

import storage from 'redux-persist/lib/storage'
import userReducer from "./slices/userSlice";
// the configuration object that we want redux persist to use

const rootReducer = combineReducers({
    user: userReducer,
});


const persistConfig = {
    key: 'insider-tracking',
    version: 1,
    storage,
    whitelist: ['user']
}


const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

export const persistor = persistStore(store)


