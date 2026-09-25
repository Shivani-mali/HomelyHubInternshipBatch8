import React from "react";
import { Link } from "react-router-dom";

const MyAccomodation = ({ accomodation }) => {
  return (
    <div className="main-container">
      {accomodation.map((accomodation) => (
        <Link
          className="myaccomodation-link"
          to={`/propertylist/${accomodation._id}`}
          key={accomodation._id}
        >
          <div className="myaccomodation-container row">
            <div className="myaccomodation-image-container col-lg-3 col-md-3">
              <img
                className="myaccomodation-img"
                src={accomodation.images?.[0]?.url || "/assets/template.jpeg"}
                alt={accomodation.propertyName}
              />
            </div>
            <div className="myaccomodation-information col-lg-9 col-md-9">
              <h6 className="myaccomodation-hotel-name">
                {accomodation.propertyName}
              </h6>
              <div className="stay-information">
                <span className="info">
                  <span className="material-symbols-outlined icon">
                    calendar_month
                  </span>
                  Check In Time: {accomodation.checkInTime}
                </span>
                <span className="material-symbols-outlined icon">
                  arrow_forward
                </span>
                <span className="info">
                  <span className="material-symbols-outlined icon">
                    calendar_month
                  </span>
                  Check Out Time: {accomodation.checkOutTime}
                </span>
              </div>
              <p className="myaccomodation-city">
                City :{accomodation.address?.city || "Not provided"}
              </p>
              <p className="myaccomodation-guest">
                Max no of guest : {accomodation.maximumGuest}
              </p>
              <h5 className="myaccomodation-price">
                <span className="material-symbols-outlined">payments</span>{" "}
                Total Price :&#8377; {accomodation.price}
              </h5>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default MyAccomodation;
