import React from "react";
import ProgressSteps from "../ProgressSteps";
import { Link } from "react-router-dom";
import "../../css/Profile.css";
import LoadingSpinner from "../LoadingSpinner";
import moment from "moment";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user, loading } = useSelector((state) => state.user);
  const avatarUrl =
    typeof user?.avatar === "string" ? user.avatar : user?.avatar?.url;

  return (
    <>
      <ProgressSteps profile />

      <div className="row justify-content-around mt-5 ">
        {loading && <LoadingSpinner />}
        {user && !loading && (
          <div className="col-6 col-md-6 profile object-fit-cover">
            <div className="avatars">
              <figure className="avatar-profile text-center">
                <img
                  className="rounded-circle w-100 h-100 "
                  src={avatarUrl}
                  alt="avatar"
                />
              </figure>
              <h3>Welcome {user.name}!</h3>
            </div>
            <div className="userinfo">
              <h4>Full Name</h4>
              <p>{user.name}</p>

              <h4>Email Address</h4>
              <p>{user.email}</p>

              <h4>Joined On</h4>
              <p>{moment(user.createdAt).format("MMMM Do YYYY")}</p>

              <div className="buttons">
                <Link
                  to="/editprofile"
                  id="edit_profile"
                  className="btn btn-block my-5"
                >
                  Edit Profile
                </Link>
                <Link
                  to="/user/updatepassword"
                  className="btn btn-block my-5 mx-4"
                >
                  Change Password
                </Link>
              </div>
            </div>
          </div>
        )}
        {!user && !loading && (
          <p className="text-center">Please log in to view your profile.</p>
        )}
      </div>
    </>
  );
};

export default Profile;
