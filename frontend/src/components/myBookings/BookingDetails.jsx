import React, { useEffect, useState } from "react";
import "../../css/BookingDetails.css";
import PropertyImg from "../propertyListing/PropertyImg";
import { useParams } from "react-router-dom";
import LoadingSpinner from "../LoadingSpinner";
import { axiosInstance } from "../../utils/axios";
import toast from "react-hot-toast";

const BookingDetails = () => {
  const { bookingId } = useParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBooking = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/v1/rent/user/booking/${bookingId}`
        );
        setBookingDetails(data.data.bookings);
      } catch (error) {
        toast.error(error.response?.data?.message || "Could not load booking");
      } finally {
        setLoading(false);
      }
    };
    loadBooking();
  }, [bookingId]);

  if (loading || !bookingDetails || !bookingDetails.property) {
    return (
      <div className="row justify-content-around mt-5">
        <LoadingSpinner />
      </div>
    );
  }

  const { property } = bookingDetails;
  return (
    <div className="details-container">
      <p className="details-header">{property.propertyName}</p>
      <h6 className="details-location">
        <span className="material-symbols-outlined">location_on</span>
        <span className="location">
          {property.address?.area}, {property.address?.city},{" "}
          {property.address?.pincode}, {property.address?.state}
        </span>
      </h6>
      <div className="details-information-container">
        <div className="details-information">
          <h5>Booking Information</h5>
          <section className="booking-stay-information">
            <span className="details">
              <span className="material-symbols-outlined stay-icon">bedtime</span>
              {bookingDetails.numberOfnights || bookingDetails.nights || 0} nights
            </span>
            <span className="details">
              <span className="material-symbols-outlined stay-icon">
                calendar_month
              </span>
              {new Date(bookingDetails.fromDate).toLocaleDateString()}
            </span>
            <span className="material-symbols-outlined stay-icon">
              arrow_forward
            </span>
            <span className="details">
              <span className="material-symbols-outlined stay-icon">
                calendar_month
              </span>
              {new Date(bookingDetails.toDate).toLocaleDateString()}
            </span>
          </section>
        </div>
        <div className="details-total-price-container">
          <div className="details-total-price">
            <p className="price-header">Total Price</p>
            <span className="price-in-number">&#8377; {bookingDetails.price}</span>
          </div>
        </div>
      </div>
      <PropertyImg images={property.images || []} />
    </div>
  );
};

export default BookingDetails;
