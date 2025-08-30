import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import cartReducer from "./cartSlice";
import  desertReducer from './desertSlice'

import rollsReducer from "./rollsSlice";
import sandWichReducer from './sandwichSlice'
import cakeReducer from './cakeSlice'
import pureReducer from './PureSlice'
import authReducer from "./authSlice";
import verifyReducer from "./verifyOtpSlice";
export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    rolls: rollsReducer, 
    desert:desertReducer,
    sandWich:sandWichReducer ,
    cake: cakeReducer,
    pure: pureReducer,
    auth: authReducer,
    verifyOtp: verifyReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
