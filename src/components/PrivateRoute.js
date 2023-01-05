import React from 'react';
import {Outlet, Navigate} from 'react-router-dom';
import {useAuth} from './useAuth'


function PrivateRoute(props) {

    let isAuth = useAuth()
    console.log(isAuth)
  return (
    isAuth? <Outlet /> : <Navigate to="/login"/>

  )
}

export default PrivateRoute;