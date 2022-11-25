import {React, useState, useEffect} from "react"

export default function ChatIput (props) {

    
    const messagesFeed = props.messageHistory.map((obj) => {
        return <div className={obj.userName === props.userData.userName? "container-chat-content-sent" : "container-chat-content-recieved"} >

                <span>{obj.time}</span>
                <span>{obj.userName}</span>
                <p>{obj.mes}</p>
            </div>
    })
    
    return(
        <div className="container-chat">
            <div className="chat-header">
                <p> Room : {props.userData.roomNum}</p>
                <p>Users</p>
            </div>
            <div className="chat-body">
                
                {messagesFeed}
                               
            </div>

            <div className="chat-footer">
                
                <input 
                placeholder="message..." 
                value={props.userData.mes} 
                name="mes" 
                onChange={props.handleForm} 
                />

                <button onClick={props.handleSend}>Send</button>
            </div>
        </div>
    )
}