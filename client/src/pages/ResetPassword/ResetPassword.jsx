import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import axios from "axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id, token } = useParams();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!password) {
      toast.error("Please enter a password.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    // reset password api here
    try {
      const response = await axios.post(
        `http://localhost:5000/api/v1/auth/${id}/reset-password/${token}`,
        { password }
      );
      toast.success("Password updated successfully.");
      setLoading(false);
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };
  return (
    <>
      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10 drop-shadow">
          <form onSubmit={handleResetPassword}>
            <h4 className="text-2xl mb-7">Reset Password</h4>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="btn-primary">
              Update Password
            </button>

            <Link to="/signup" className=" font-medium text-primary underline">
              Signup
            </Link>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
