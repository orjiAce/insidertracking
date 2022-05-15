import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
// hooks

// routes

import {useSelector} from "react-redux";

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node
};

export default function GuestGuard({ children }) {
  const user = useSelector(state => state.user)
  const {

    isAuthenticated,
  } = user


  if (isAuthenticated) {
    return <Navigate to="dashboard/app" />;
  }

  return <>{children}</>;
}
