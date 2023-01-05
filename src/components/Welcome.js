import React from 'react'

function Welcome(props) {

    const {username} = props.currentUser.user;
    const morning = 'Good Morning';
    const afternoon = 'Good afternoon';
    const evening = 'Good evening';
    let time = new Date().getHours();
    let greeting = time > 16? evening
    : time > 11? afternoon 
    : morning
    
  return (

    <div>
        <h2>{`${greeting} ${username}`}</h2>
        <p>Choose someone to chat with..</p>


    </div>
  )
}

export default Welcome