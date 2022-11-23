import {React, useState, useEffect} from "react"

export default function ChatIput (props) {

// const handleKey = () => {
//     // props.setIsWriting(prevWriting => !prevWriting)
//     props.showisWriting();
// }

    const messagesFeed = props.messageHistory.map(obj => {
        return <div className={obj.userName === props.userData.userName? "container-chat-content-sent" : "container-chat-content-recieved"}>

                <span>{obj.time}</span>
                <span>{obj.userName}</span>
                <p>{obj.mes}</p>
            </div>
    })



    return(
        <div className="container-chat">
            <div className="chat-header">
                <p>ChatApp</p>
            </div>
            <div className="chat-body">
                
                {messagesFeed}
                
            </div>

            <div className="chat-footer">
                <input placeholder="name..." value={props.userData.userName} name="userName" onChange={props.handleForm}/>

                <input 
                placeholder="message..." 
                value={props.userData.mes} 
                name="mes" 
                onChange={props.handleForm} 
                // onKey={props.showisWriting}
                />

                <button onClick={props.handleSend}>Send</button>
            </div>
        </div>
    )
}