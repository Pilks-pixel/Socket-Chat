import React from 'react';
import {Outlet, Navigate} from 'react-router-dom';
import {useAuth} from './useAuth'


function PublicRoutes(props) {

    let isAuth = useAuth()
  return (
    isAuth? <Navigate to="/"/> : <Outlet />

  )
}

export default PublicRoutes;