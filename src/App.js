import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { NextUIProvider } from "@nextui-org/react";
import { routes } from "./routes";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Footer from "./components/Footer";
import Header from "./components/header";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import RoomDetail from "./pages/roomDetail";
import Projecticon from "./assets/Projecticon.ico";
import WhyUs from "./components/WhyUs";
import FloatingButtons from "./components/FloatingButtons";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { login } from "./redux/slice/Authslice";
import Payment from './pages/Payment';
import PaymentResult from './pages/PaymentResult';

export default function App() {
  const queryClient = new QueryClient();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is logged in from localStorage
    const token = localStorage.getItem('Authorization');
    const role = localStorage.getItem('role');

    
    if (token && role) {
      console.log('Dispatching login with role:', role);
      dispatch(login({ role }));
    }
  }, [dispatch]);

  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <Router>
            <Helmet>
              <title>Apartment Control</title>
              <meta name="description" content="Apartment Control" />
              <link rel="icon" href={Projecticon} />
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
                        <div className="flex flex-col flex-grow">
                          {route.header && (
                            <Header title={route.title} role={route.role} />
                          )}
                          <Page />
                        </div>
                      }
                    />
                  );
                })}
                <Route path="/news" element={<News />} />
                <Route path="/news/:id" element={<NewsDetail />} />
                <Route path="/room-detail/:roomId" element={<RoomDetail />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/payment/result" element={<PaymentResult />} />
              </Routes>
              <WhyUs />
              <FloatingButtons />
              <Footer />
            </div>
          </Router>
        </HelmetProvider>
      </QueryClientProvider>
    </NextUIProvider>
  );
}
