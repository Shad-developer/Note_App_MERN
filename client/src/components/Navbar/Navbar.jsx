import React from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../app/authSlice";
import axios from "axios";

// Set axios default config
axios.defaults.withCredentials = true;

const Navbar = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const onLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/logout"
      );
      if (response.status === 200) {
        dispatch(logout());
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow-md">
      <h2 className="text-xl font-medium text-black py-2">Notes</h2>
      <ProfileInfo onLogout={onLogout} user={user} />
    </div>
  );
};

export default Navbar;
