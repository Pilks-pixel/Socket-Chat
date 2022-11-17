import {React, useState} from "react"

export default function ChatIput (props) {

// const handleKey = () => {
//     // props.setIsWriting(prevWriting => !prevWriting)
//     props.showisWriting();
// }

    return(
        <div className="container-chat">
            <div className="chat-header">

            </div>
            <div className="chat-body">
                <h1>{props.recievedMessages.userName}: {props.recievedMessages? props.recievedMessages.mes: ''} </h1> 

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