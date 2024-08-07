import React, { useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../components/Loader/Loader";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axios from "axios";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleForgotPassword = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    // forgot password email send api here
    try {
      const response = await axios.post(
        "http://localhost:5000/api/v1/auth/forgot-password",
        { email }
      );
      toast.success("Password reset link sent to your email.");
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10 drop-shadow">
          <form onSubmit={handleForgotPassword}>
            <h4 className="text-2xl mb-7">Forgot Password</h4>
            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? <Loader /> : " Send Password Reset Link"}
            </button>

            <Link to="/signup" className=" font-medium text-primary underline">
              Signup
            </Link>
            <Link to="/login" className=" font-medium pl-5 text-primary underline">
              Login
            </Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
