import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {combineEpics, createEpicMiddleware} from "redux-observable";
import {RegistrationEpic } from "./Example/RegistrationEpic";
import { AuthorizationEpic, GetAccessTokenEpic, GoogleAuthorizationEpic, SignOutEpic } from "./Example/AuthorizationEpic";
import UserReducer from "./Example/Reducers/UserReducer";
import NotificationReducer from "./Example/Reducers/NotificationReducer";
import AuthorizationReducer from "./Example/Reducers/AuthorizationReducer";
import RefreshTokenReducer from "./Example/Reducers/RefreshTokenReducer";
import RegistrationReducer from "./Example/Reducers/RegistrationReducer";
import CategoryReducer  from "./Example/Reducers/CategoryItemsReducer";
import { CategoryItemsEpic } from "./Example/CategoryItemsEpic";

const epicMiddleware = createEpicMiddleware()

const rootEpic = combineEpics(
    AuthorizationEpic,
    SignOutEpic,
    GetAccessTokenEpic,
    RegistrationEpic,
    GoogleAuthorizationEpic,
    CategoryItemsEpic
)

const rootReducer = combineReducers({
    Authorization: AuthorizationReducer,
    User: UserReducer,
    Notifications: NotificationReducer,
    RefreshToken: RefreshTokenReducer,
    Category:CategoryReducer,
    Registration:RegistrationReducer,
 
})

export const store = configureStore({
    reducer: rootReducer
    ,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(epicMiddleware)
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
epicMiddleware.run(rootEpic)