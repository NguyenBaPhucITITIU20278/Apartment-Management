import{QueryClient, QueryClientProvider} from '@tanstack/react-query'
import{HelmetProvider,Helmet} from 'react-helmet-async'
import {NextUIProvider} from '@nextui-org/react'
import{ routes } from './routes'
import{BrowserRouter as Router,Routes,Route} from 'react-router-dom'
 export default function App() {
  const queryClient = new QueryClient()
  return (
    <NextUIProvider>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <Router>
            <Helmet>
              <title>Apartment Control</title>
              <meta name="description" content="Apartment Control" />
            </Helmet>
            <Routes>
            {routes.map((route) => {
                const Page = route.page;
                return (
                  <Route key={route.path} path={route.path} element={<Page/>}/>
                )
              })}
            </Routes>
          </Router>
        </HelmetProvider>
      </QueryClientProvider>
    </NextUIProvider>
  );
}


