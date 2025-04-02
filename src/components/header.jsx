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

  const goToLogin = () => {
    navigate("/login");
  };

  const goToRegister = () => {
    navigate("/register");
  };
  const goToMainPage = () => {
    navigate("/");
  };
  const goToControlUser = () => {
    navigate("/adminControlUser");
  };

  const goToNews = () => {
    navigate("/news");

  };
  const goToAddRoom = () => {
    navigate("/addRoom");
  };
  const goToUpdateUser = () => {
    navigate("/updateUser");
  };

  return (
    <header className="flex items-center justify-between bg-blue-600 p-4">
      <nav className="flex-grow">
        <ul className="flex space-x-6">
          <img className="w-14 h-14 cursor-pointer" onClick={goToMainPage} src={homelogo} alt="home" />

          {role === "user" || role === "" ? (
            <>

              <button className="text-white" onClick={goToAddRoom}>Add Room</button>

              {/* <button className="text-white">Rent Land</button> */}
              <button className="text-white" onClick={goToNews}>Blogs</button>
              {/* <button className="text-white">Price</button> */}

              <button className="text-white" onClick={() => navigate('/my-rooms')}>List My Apartments</button>

            </>
          ) : (
            <button className="text-white" onClick={goToControlUser}>Control User</button>
          )}
        </ul>
      </nav>
      <div className="flex space-x-2 ml-auto">
        {userName ? (
          <>
            <span className="text-white text-2xl">Welcome, <span className="font-bold cursor-pointer" onClick={goToUpdateUser}>{userName}</span></span>
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
            {/* <button
              className="bg-white text-blue-700 border border-blue-700 rounded-md px-4 py-2 hover:bg-blue-700 hover:text-white transition"
              onClick={goToLogin}
            >
              Free Posting
            </button> */}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;