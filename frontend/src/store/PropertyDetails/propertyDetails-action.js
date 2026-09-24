import { propertyDetailsAction } from "./propertyDetails-slice";
import { axiosInstance } from "../../utils/axios";

// fetch details of one specific property using its id

// receive property id
// start loading
// call backend api
// wait for response
// get the property data
// store details in redux
// if error store error in redux

export const getPropertyDetails = (id) => async (dispatch) => {
    try {
        // start loading
        dispatch(propertyDetailsAction.getListRequest());

        // call backend api with property id
        const response = await axiosInstance(`/v1/rent/listing/${id}`);

        console.log(response);

        // check if response is received
        if (!response) {
            throw new Error("Could not fetch any propertyDetails");
        }

        // get property data from response
        const { data } = response.data;

        // store property details in redux
        dispatch(propertyDetailsAction.getPropertyDetails(data));
    } catch (error) {
        // store error in redux
        const message = error.response?.data?.message
            || error.response?.data?.error
            || error.message;
        dispatch(propertyDetailsAction.getErrors(message));
    }
};