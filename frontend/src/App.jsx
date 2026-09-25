import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import PropertyList from "./components/home/PropertyList";
import PropertyListing from "./components/propertyListing/PropertyListing";
import Main from "./components/home/Main";
import Accomodation from "./components/accomodation/Accomodation";
import Login from "./components/user/Login";
import Signup from "./components/user/Signup";
import Profile from "./components/user/Profile";
import EditProfile from "./components/user/EditProfile";
import MyBookings from "./components/myBookings/MyBookings";
import BookingDetails from "./components/myBookings/BookingDetails";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/LoadingSpinner";
import AccomodationForm from "./components/accomodation/AccomodationForm";
import ForgetPassword from "./components/user/ForgetPassword";
import ResetPassword from "./components/user/ResetPassword";
import UpdatePassword from "./components/user/UpdatePassword";
import Payment from "./components/payment/Payment";
import NotFound from "./components/NotFound";
import AiTripPlanner from "./components/aiTripPlanner/AiTripPlanner";
import { currentUser } from "./store/User/user-action";

function App() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(currentUser());
  }, [dispatch]);

  return (
    <div className="App">
      <Toaster position="bottom-center" reverseOrder={false} />
      <Router>
        <Routes>
          <Route path="/" element={<Main />}>
            <Route index element={<PropertyList />} />
            <Route path="propertylist/:id" element={<PropertyListing />} />

            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="profile" element={<Profile />} />
            <Route
              path="editprofile"
              element={
                loading ? (
                  <LoadingSpinner />
                ) : user ? (
                  <EditProfile />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route path="ai-trip-planner" element={<AiTripPlanner />} />

            <Route
              path="accomodation"
              element={
                loading ? (
                  <LoadingSpinner />
                ) : user ? (
                  <Accomodation />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="accomodationform"
              element={
                loading ? (
                  <LoadingSpinner />
                ) : user ? (
                  <AccomodationForm />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route path="user/forgotPassword" element={<ForgetPassword />} />
            <Route
              path="user/resetPassword/:token"
              element={<ResetPassword />}
            />
            <Route
              path="user/updatepassword"
              element={
                loading ? (
                  <LoadingSpinner />
                ) : user ? (
                  <UpdatePassword />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="user/mybookings"
              element={
                loading ? (
                  <LoadingSpinner />
                ) : user ? (
                  <MyBookings />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="user/mybookings/:bookingId"
              element={
                loading ? (
                  <LoadingSpinner />
                ) : user ? (
                  <BookingDetails />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route
              path="payment/:propertyId"
              element={
                loading ? (
                  <LoadingSpinner />
                ) : user ? (
                  <Payment />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
