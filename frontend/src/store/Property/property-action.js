import { propertyAction } from "./property-slice.js";
import { axiosInstance } from "../../utils/axios.js";

//get all properties
//1. start api service
//2. tell redux loading started
//3. get serch parameters
//4. call backend api
//5. Wait for responce
//6. Get property data
//7. send data to the redux store
//8. if error => send error to redux



//dispatch => SEND to Redux
//getState => GET from Redux
export const getAllProperties = () => async (dispatch, getState) => {
    try {

        console.log("API call started");
        dispatch(propertyAction.getRequest())
        const { searchParams } = getState().properties

        console.log(searchParams)

        const response = await axiosInstance.get("/v1/rent/listing", {
            params: { ...searchParams }
        })

        if (!response) {
            throw new Error("Could not fetch any properties")
        }

        const { data } = response;
        console.log(data);

        dispatch(propertyAction.getProperties(data))


    }
    catch (error) {
        dispatch(propertyAction.getErrors(error.message))
    }
};