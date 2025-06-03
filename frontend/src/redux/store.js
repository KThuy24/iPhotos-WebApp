import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import authReducer from "./auth.Slice.js";
import photoReducer from "./photo.Slice.js";
import albumReducer from "./album.Slice.js";
import likeReducer from "./like.Slice.js";
import commentReducer from "./commentSlice.js";

import {
    //persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from "redux-persist";
//------------------------------------------------------------------------//
const persistConfig = {
    key: "root",
    version: 1,
    storage,
};

const rootReducer = combineReducers({
    auth: authReducer,
    photo: photoReducer,
    album: albumReducer,
    like: likeReducer,
    comment: commentReducer
});
  
const persistedReducer = persistReducer(persistConfig, rootReducer);
//------------------------------------------------------------------------//
const store = configureStore({
    reducer: persistedReducer,
    middleware: (
      getDefaultMiddleware // getDefaultMiddleware lấy middle mặc định của redux-toolkit
    ) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            // bỏ qua các actions này
            FLUSH,
            REHYDRATE,
            PAUSE,
            PERSIST,
            PURGE,
            REGISTER,
          ],
        },
      }),
});
  
export default store;