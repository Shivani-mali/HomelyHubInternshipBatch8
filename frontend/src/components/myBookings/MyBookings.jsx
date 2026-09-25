import React, { useEffect, useState } from "react";
import "../../css/MyBookings.css";
import ProgressSteps from "../ProgressSteps";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import { axiosInstance } from "../../utils/axios";
import toast from "react-hot-toast";

const MyBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const { data } = await axiosInstance.get("/v1/rent/user/booking");
        setBookings(data.data.bookings || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not load bookings");
      } finally {
        setLoading(false);
      }
    };
    loadBookings();
  }, []);

  const handleBookingClick = (bookingId) => {
    navigate(`/user/myBookings/${bookingId}`);
  };

  const handleCancelBooking = async (event, bookingId) => {
    event.stopPropagation();
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await axiosInstance.delete(`/v1/rent/user/booking/${bookingId}`);
      setBookings((current) =>
        current.filter((booking) => booking._id !== bookingId)
      );
      toast.success("Booking cancelled");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not cancel booking");
    }
  };

  if (bookings.length === 0 && !loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <h3>Nothing booked yet</h3>
      </div>
    );
  }
  return (
    <>
      <ProgressSteps />
      <div className="wow">
        {loading && <LoadingSpinner />}
        {!loading &&
          bookings.length > 0 &&
          bookings.map((booking) => (
            <div
              className="main-container"
              onClick={() => handleBookingClick(booking._id)}
              key={booking._id}
            >
              <div className="mybookings-container row">
                <div className="image-container col-lg-3 col-md-3">
                  <img
                    className="booking-img"
                    src={
                      booking.property?.images?.[0]?.url ||
                      "/assets/template.jpeg"
                    }
                    alt={booking.property?.propertyName || "Booking"}
                  />
                </div>
                <div className="booking-information col-lg-9 col-md-9">
                  <h6 className="hotel-name">
                    {booking.property?.propertyName || "Accommodation"}
                  </h6>
                  <div className="stay-information">
                    <span className="info">
                      <span className="material-symbols-outlined icon">
                        bedtime
                      </span>
                      {booking.numberOfnights || booking.nights || 0} nights
                    </span>
                    <span className="info">
                      <span className="material-symbols-outlined icon">
                        calendar_month
                      </span>
                      {new Date(booking.fromDate).toLocaleDateString()}
                    </span>
                    <span className="material-symbols-outlined icon">
                      arrow_forward
                    </span>
                    <span className="info">
                      <span className="material-symbols-outlined icon">
                        calendar_month
                      </span>
                      {new Date(booking.toDate).toLocaleDateString()}
                    </span>
                  </div>
                  <h5 className="booking-price">
                    <span className="material-symbols-outlined">payments</span>{" "}
                    Total Price :&#8377; {booking.price}
                  </h5>
                  <button
                    type="button"
                    className="cancel-booking-button"
                    onClick={(event) => handleCancelBooking(event, booking._id)}
                  >
                    Cancel booking
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default MyBookings;
