import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import homelogo from "../assets/homelogo.jpg";

const Header = ({ title, role }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const userState = useSelector((state) => state);
  let user = role === "user" ? userState.user : userState.admin;

  useEffect(() => {
    const storedUserName = localStorage.getItem("userName");
    if (storedUserName) {
      setUserName(storedUserName);
    }

    const handleStorageChange = () => {
      const updatedUserName = localStorage.getItem("userName");
      setUserName(updatedUserName);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const signOut = () => {
    localStorage.clear();
    window.location.reload();
  };

  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isHomePage = location.pathname === "/";

  const goToLogin = () => {
    if (!isLoginPage && !isRegisterPage) {
      navigate("/login");
    }
  };

  const goToRegister = () => {
    if (!isLoginPage && !isRegisterPage) {
      navigate("/register");
    }
  };

  const goToRentRoom = () => {
    if (!isLoginPage && !isRegisterPage) {
      navigate("/rentroom");
    }
  };

  const goToMainPage = () => {
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between bg-blue-600 p-4">
      <nav className="flex-grow">
        <ul className="flex space-x-6">
          <img className="w-14 h-14 cursor-pointer" onClick={goToMainPage} src={homelogo} alt="home" />

          <button className="text-white" onClick={goToRentRoom}>
            Rent Room
          </button>

          <button className="text-white">Rent Apartment</button>
          <button className="text-white">Rent Land</button>
          <button className="text-white">News</button>
          <button className="text-white">Price</button>
        </ul>
      </nav>
      <div className="flex space-x-2 ml-auto">
        {userName ? (
          <>
            <span className="text-white text-2xl">Welcome, <span className="font-bold">{userName}</span></span>
            <button className="text-white text-2xl" onClick={signOut}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <button
              className="bg-white text-blue-700 border border-blue-700 rounded-md px-4 py-2 hover:bg-blue-700 hover:text-white transition"
              onClick={goToRegister}
            >
              Sign Up
            </button>
            <button
              className="bg-white text-blue-700 border border-blue-700 rounded-md px-4 py-2 hover:bg-blue-700 hover:text-white transition"
              onClick={goToLogin}
            >
              Sign In
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;