import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { IoIosMoon, IoMdSunny } from "react-icons/io";
import { HiOutlineBars3 } from "react-icons/hi2";
import { AiOutlineClose } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { voteActions } from "../store/vote-slice";

const Navbar = () => {
  const [showNavMenu, setShowNavMenu] = useState(
    window.innerWidth < 600 ? false : true
  );
  const [darkTheme, setDarkTheme] = useState(
    localStorage.getItem("voting-app-theme") || ""
  );
  const token = useSelector((state) => state.vote.currentVoter?.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const closeShowNavMenu = () => {
    setShowNavMenu(window.innerWidth >= 600);
  };

  const handleChangeTheme = () => {
    const currentTheme =
      localStorage.getItem("voting-app-theme") === "dark" ? "" : "dark";
    localStorage.setItem("voting-app-theme", currentTheme);
    setDarkTheme(currentTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser"); // Remove user data from localStorage
    dispatch(voteActions.changeCurrentVoter(null)); // Reset Redux state
    // window.location.reload(); // Refresh or redirect as needed
    navigate("/");
  };

  useEffect(() => {
    document.body.className = localStorage.getItem("voting-app-theme");
  }, [darkTheme]);

  return (
    <nav>
      <div className="container nav__container">
        <Link className="nav__logo">ECGhana</Link>
        <div>
          {!token ? (
            <menu>
              <NavLink to="/" onClick={closeShowNavMenu}>
                Login
              </NavLink>
            </menu>
          ) : (
            token &&
            showNavMenu && (
              <menu>
                <NavLink to="/elections" onClick={closeShowNavMenu}>
                  Elections
                </NavLink>
                <NavLink to="/results" onClick={closeShowNavMenu}>
                  Results
                </NavLink>
                <NavLink
                  onClick={() => {
                    closeShowNavMenu();
                    handleLogout();
                  }}
                >
                  Logout
                </NavLink>
              </menu>
            )
          )}

          <button className="theme__toggle-btn" onClick={handleChangeTheme}>
            {darkTheme ? <IoMdSunny /> : <IoIosMoon />}
          </button>

          <button
            className="nav__toggle-btn"
            onClick={() => setShowNavMenu((show) => !show)}
          >
            {showNavMenu ? <AiOutlineClose /> : <HiOutlineBars3 />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
