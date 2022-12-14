import React from 'react'
import { useNavigate } from 'react-router-dom';


export const SignOut = () => {
    const goTo = useNavigate();


    function handleSignOut() {
        localStorage.removeItem('jwtToken');
        goTo("/login")

  }

  return (
    <div>
        <button onClick={handleSignOut} >Sign Out</button>
    </div>
  )
}
