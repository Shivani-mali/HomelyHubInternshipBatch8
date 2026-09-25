import { userActions } from "./user-slice";
import { axiosInstance } from "../../utils/axios";

// signup

export const getSignup = (user) => async (dispatch) => {
    try {
        // start loading
        dispatch(userActions.getSignupRequest());

        // call signup API
        const { data } = await axiosInstance.post("/v1/rent/user/signup", user);

        // store signup details in redux
        dispatch(userActions.getSignupDetails(data.user));
    } catch (error) {
        // store error in redux
        dispatch(userActions.getError(error.response?.data?.message || "Could not create account"));
    }
};

// login

export const getLogin = (user) => async (dispatch) => {
    try {
        // start loading
        dispatch(userActions.getLoginRequest());

        // call login API
        const { data } = await axiosInstance.post("/v1/rent/user/login", user);

        // store login details in redux
        dispatch(userActions.getLoginDetails(data.user));
    } catch (error) {
        // store error in redux
        dispatch(userActions.getError(error.response?.data?.message || "Could not log in"));
    }
};

// get current logged-in user

export const currentUser = () => async (dispatch) => {
    try {
        // start loading
        dispatch(userActions.getCurrentRequest());

        // call current user API
        const { data } = await axiosInstance.get("/v1/rent/user/me");

        // store current user details in redux
        dispatch(userActions.getCurrentUser(data.user));
    } catch {
        // logout user if current user request fails
        dispatch(userActions.getLogout(null));
    }
};

// update user

export const updateUser = (updateUser) => async (dispatch) => {
    try {
        // start loading
        dispatch(userActions.getUpdateUserRequest());

        // call update user API
        await axiosInstance.patch(
            "/v1/rent/user/updateMe",
            updateUser
        );

        const {data} = await axiosInstance.get("/v1/rent/user/me");

        // store updated user details in redux
        dispatch(userActions.getCurrentUser(data.user));
        return true;
    } catch (error) {
        // store error in redux
        dispatch(userActions.getError(error.response?.data?.message || "Could not update profile"));
        return false;
    }
};

// forgot password

export const forgotPassword = (email) => async (dispatch) => {
    try {
        // call forgot password API
        await axiosInstance.post("/v1/rent/user/forgotPassword", { email });
    } catch (error) {
        // store error in redux
        dispatch(userActions.getError(error.response.data.message));
    }
};

// reset password

export const resetPassword = (repasword, token) => async (dispatch) => {
    try {
        // call reset password API
        await axiosInstance.patch(
            `/v1/rent/user/resetPassword/${token}`,
            repasword
        );
    } catch (error) {
        // store error in redux
        dispatch(userActions.getError(error.response.data.message));
    }
};

// update password

export const updatePassword = (passwords) => async (dispatch) => {
    try {
        // start loading
        dispatch(userActions.getPasswordRequest());

        // call update password API
        await axiosInstance.patch(
            "/v1/rent/user/updateMyPassword",
            passwords
        );

        // update password success
        dispatch(userActions.getPasswordSuccess(true));
    } catch (error) {
        // store error in redux
        dispatch(userActions.getError(error.response.data.message));
    }
};

// logout

export const logout = () => async (dispatch) => {
    try {
        // call logout API
        await axiosInstance.get("/v1/rent/user/logout");
        dispatch(userActions.getLogout(null));
    } catch (error) {
        // store error in redux
        dispatch(userActions.getError(error.response?.data?.message || "Could not log out"));
    }
};