import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import homelogo from "../assets/homelogo.jpg";



const Header = ({ title }) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [role, setRole] = useState("");
  const user = useSelector((state) => state.user);
  const admin = useSelector((state) => state.admin);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUserName = localStorage.getItem('userName');
      const storedRole = localStorage.getItem('role');
      if (storedUserName) {
        setUserName(storedUserName);
      }
      if (storedRole) {
        setRole(storedRole);
      }
    };

    fetchUserData();
  }, [user, admin]);

  const signOut = () => {
    localStorage.clear();
    window.location.reload();
    navigate("/");
    window.location.reload();
  };

  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isHomePage = location.pathname === "/";

  const goToLogin = () => {
    navigate("/login"); 
  };

  const goToRegister = () => {
    navigate("/register");
  };

  const goToRentRoom = () => {
    navigate("/rentroom");
  };

  const goToMainPage = () => {
    navigate("/");
  };
  const goToControlUser = () => {
    navigate("/adminControlUser");
  };

  return (
    <header className="flex items-center justify-between bg-blue-600 p-4">
      <nav className="flex-grow">
        <ul className="flex space-x-6">
          <img className="w-14 h-14 cursor-pointer" onClick={goToMainPage} src={homelogo} alt="home" />

          {role === "user" || role === "" ? (
            <>
              <button className="text-white" onClick={goToRentRoom}>
                Rent Room
              </button>
              <button className="text-white">Rent  Apartment</button>
              <button className="text-white">Rent Land</button>
              <button className="text-white">News</button>
              <button className="text-white">Price</button>
            </>
          ) : (
            <button className="text-white" onClick={goToControlUser}>Control User</button>
          )}
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