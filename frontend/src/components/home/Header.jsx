import React from "react";
import Search from "./Search";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Filter from "./Filter";
import toast from "react-hot-toast";
import "../../css/AiTripPlanner.css";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/User/user-action";
import { propertyAction } from "../../store/Property/property-slice.js";
import { getAllProperties } from "../../store/Property/property-action.js";

const Header = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const avatarUrl =
    typeof user?.avatar === "string" ? user.avatar : user?.avatar?.url;

  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const logoutUser = async () => {
    await dispatch(logout());
    toast.success("User has logged out successfully");
    navigate("/login");
  };

  const refreshFunction = () => {
    dispatch(propertyAction.updateSearchParams({}));
    dispatch(getAllProperties());
  };

  return (
    <>
      <nav className="header row sticky-top ">
        <Link to="/">
          <img
            src="/assets/logo.png"
            alt="logo"
            className="logo"
            onClick={refreshFunction}
          />
        </Link>
        {isHomePage && (
          <div className="search_filter">
            <Search />
            <Filter />

            <Link to="/ai-trip-planner" className="ai-trip-link">
              <span className="material-symbols-outlined">auto_awesome</span>
              <span>Trip Genie</span>
            </Link>
          </div>
        )}
        {!isAuthenticated && !user && (
          <Link to="/login" className="login-tip">
            <span className="material-symbols-outlined web_logo">
              account_circle
            </span>
            <span className="login-tip-text">You are not logged in. Please login</span>
          </Link>
        )}
        {isAuthenticated && user && (
          <div className="dropdown">
            <span
              className="dropdown-toggle d-flex align-items-center"
              role="button"
              id="dropdownMenuLink"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ cursor: "pointer" }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  className="user-img"
                  alt={user.name || "user profile"}
                />
              ) : (
                <span className="material-symbols-outlined web_logo">
                  account_circle
                </span>
              )}
            </span>

            <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <li>
                <Link className="dropdown-item" to="/profile">
                  {" "}
                  My Account
                </Link>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={logoutUser}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>
    </>
  );
};
export default Header;
