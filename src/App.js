import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { NextUIProvider } from "@nextui-org/react";
import { routes } from "./routes";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/header";
import Home from "./pages/home";
import News from "./pages/News"; // Import trang News
import NewsDetail from "./pages/NewsDetail"; // Import trang NewsDetail
import RoomDetail from "./pages/roomDetail"; // Import trang RoomDetail
import { useSelector } from "react-redux";
import { Fragment, useEffect, useState } from "react";
import Projecticon from "./assets/Projecticon.ico";
import WhyUs from "./components/WhyUs"; // Import the WhyUs component

export default function App() {
  const queryClient = new QueryClient();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState("");

  const AuthWrapper = ({ children, title }) => {
    const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // useEffect(() => {
    //   if (title !== 'Login Page' && title !== 'Forgot Password') {
    //     if (!isAuthenticated && !localStorage.getItem('accessToken')) {
    //       navigate('/login')
    //     }
    //   }
    // }, [isAuthenticated, isLoading, navigate, title]);

    return children;
  };

  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <Router>
            <Helmet>
              <title>Apartment Control</title>
              <meta name="description" content="Apartment Control" />
              <link rel="icon" href={Projecticon} />{" "}
              {/* Thay đổi đường dẫn này */}
            </Helmet>
            <div className="flex flex-col min-h-screen">
              <Routes>
                {routes.map((route) => {
                  const Page = route.page;
                  return (
                    <Route
                      key={route.path}
                      path={route.path}
                      element={
                        <AuthWrapper title={route.title}>
                          <Helmet>
                            <title>{route.title}</title>
                            <link rel="icon" href={Projecticon} />{" "}
                            {/* Thay đổi đường dẫn này */}
                          </Helmet>
                          <div className="flex flex-col flex-grow">
                            {route.header && (
                              <Header title={route.title} role={route.role} />
                            )}
                            <Page />
                          </div>
                        </AuthWrapper>
                      }
                    />
                  );
                })}
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/room-detail/:roomId" element={<RoomDetail />} />
              </Routes>
              <WhyUs /> {/* Add the WhyUs component here */}
              <Footer />
            </div>
          </Router>
        </HelmetProvider>
      </QueryClientProvider>
    </NextUIProvider>
  );
}
