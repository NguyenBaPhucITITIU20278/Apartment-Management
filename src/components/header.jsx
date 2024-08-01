import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const Header = ({ title, role }) => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const userState = useSelector(state => state);
  let user = role === "user" ? userState.user : userState.admin;

  useEffect(() => {
    const storedId = localStorage.getItem('id');
    if (storedId) {
      setId(storedId);
    }

    const handleStorageChange = () => {
      const updatedId = localStorage.getItem('id');
      setId(updatedId);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
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
      navigate('/login');
    }
  };

  const goToRegister = () => {
    if (!isLoginPage && !isRegisterPage) {
      navigate('/register');
    }
  };

  const goToRentRoom = () => {
    if (!isLoginPage && !isRegisterPage) {
      navigate('/rentroom');
    }
  };

  return (
    <header className="flex items-center justify-between bg-blue-600 p-4">
      <nav className="flex-grow">
        <ul className="flex space-x-6">
          <button className="text-white" onClick={goToRentRoom}>Rent Room</button>
          <button className="text-white">Rent House</button>
          <button className="text-white">Rent Apartment</button>
          <button className="text-white">Rent Land</button>
          <button className="text-white">News</button>
          <button className="text-white">Price</button>
        </ul>
      </nav>
      <div className="flex space-x-2 ml-auto">
        {id ? (
          <>
            <span className="text-white">Welcome, {id}</span>
            <button className="text-white" onClick={signOut}>Sign Out</button>
          </>
        ) : (
          <>
            <button className="bg-red-950 text-red-400 border border-red-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
              <span className="bg-red-400 shadow-red-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
              <button onClick={goToLogin}>Login</button>
            </button>
            <button className="relative border hover:border-sky-600 duration-500 group cursor-pointer text-sky-50  overflow-hidden h-14 w-32 rounded-md bg-sky-800 p-2 flex justify-center items-center font-extrabold">
              <div className="absolute z-10 w-48 h-48 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-900 delay-150 group-hover:delay-75"></div>
              <div className="absolute z-10 w-40 h-40 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-800 delay-150 group-hover:delay-100"></div>
              <div className="absolute z-10 w-32 h-32 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-700 delay-150 group-hover:delay-150"></div>
              <div className="absolute z-10 w-24 h-24 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-600 delay-150 group-hover:delay-200"></div>
              <div className="absolute z-10 w-16 h-16 rounded-full group-hover:scale-150 transition-all  duration-500 ease-in-out bg-sky-500 delay-150 group-hover:delay-300"></div>
              <p className="z-10" onClick={goToRegister}>Register</p>
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;