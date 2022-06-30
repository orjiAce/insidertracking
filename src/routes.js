import {lazy,Suspense} from 'react'
import {Navigate, useLocation, useRoutes} from 'react-router-dom';
import {CircularProgress} from "@mui/material";

// layouts
import DashboardLayout from './layouts/dashboard';
import LogoOnlyLayout from './layouts/LogoOnlyLayout';
//



import NotFound from './pages/Page404';
import Products from './pages/Products';
import AuthGuard from "./guards/AuthGuard";
import GuestGuard from "./guards/GuestGuard";





const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();


  return (
      <Suspense
          fallback={
         <div style={{
           width:'100%',
           alignItems:'center',
           height:'100vh',
           justifyContent:'center'
         }}>
           <CircularProgress color="secondary" />

         </div>
          }
      >
        <Component {...props} />
      </Suspense>
  );
};


// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/dashboard',
      element: (
          <AuthGuard>
            <DashboardLayout />
          </AuthGuard>
      ),
      children: [
        { path: 'app', element: <DashboardApp /> },
        { path: 'user', element: <UserAccount /> },
        { path: 'user-setting', element: <UserAccount /> },
        { path: 'watchlist', element: <WatchList /> },
        { path: 'products', element: <Products /> },
        { path: 'chart/:ticker', element: <StockChart /> },
        { path: 'blog', element: <Blog /> },
      ],
    },
    {
      path: '/',
      element:    <GuestGuard> <LogoOnlyLayout /> </GuestGuard>,
      children: [
        { path: '/', element: <Login /> },
        { path: 'login', element: <Login /> },
        { path: 'register', element: <Register /> },
        { path: 'reset-password', element: <ResetPassword /> },
        { path: '404', element: <NotFound /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}


const Blog = Loadable(lazy(() => import('./pages/Blog')))
const UserAccount = Loadable(lazy(() => import('./pages/UserAccount')))
const WatchList = Loadable(lazy(() => import('./pages/WatchList')))
const StockChart = Loadable(lazy(() => import('./pages/StockChart')))
const User = Loadable(lazy(() => import('./pages/User')))
const Login = Loadable(lazy(() => import('./pages/Login')))
const ResetPassword = Loadable(lazy(() => import('./pages/ResetPassword')))
const DashboardApp = Loadable(lazy(() => import('./pages/DashboardApp')))
const Register = Loadable(lazy(() => import('./pages/Register')))

