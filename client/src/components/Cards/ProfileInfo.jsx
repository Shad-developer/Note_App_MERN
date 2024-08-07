import React from "react";
import { Link } from "react-router-dom";
import { getInitials } from "../../utils/helper";

const profileInfo = ({ user, onLogout }) => {
  return (
    <>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
          {getInitials(user ? user.name : "Guest")}
        </div>
        <div>
          <p className="text-sm font-medium">{user ? user.name : "Guest"}</p>

          {user ? (
            <button
              className="text-sm text-slate-700 underline"
              onClick={onLogout}
            >
              Logout
            </button>
          ) : (
            <button className="text-sm text-slate-700 underline">
              <Link to="/login">Login</Link>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default profileInfo;
