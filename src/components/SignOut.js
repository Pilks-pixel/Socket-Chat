import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';


export const SignOut = (props) => {
    const goTo = useNavigate();


    function handleSignOut() {
        localStorage.removeItem('jwtToken');
        props.socket.emit('remove_user', props.currentUser.user._id);
        goTo("/login")

  }

    

  return (
    <div>
        <button onClick={handleSignOut} >Sign Out</button>
    </div>
  )
}
