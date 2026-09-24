import { configureStore } from "@reduxjs/toolkit";
import propertySlice from "./Property/property-slice";
import propertyDetailsSlice from "./PropertyDetails/propertyDetails-slice";
import userSlice from "./User/user-slice";
import accomodationSlice from "./Accomodation/Accomodation-slice";
import paymentSlice from "./Payment/payment-slice";

const store = configureStore({
    reducer: {
        properties: propertySlice,
        propertyDetails: propertyDetailsSlice,
        user: userSlice.reducer,
        accomodation: accomodationSlice.reducer,
        payment: paymentSlice.reducer
    }
})

export default store;