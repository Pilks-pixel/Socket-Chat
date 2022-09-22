import {React, useState} from "react"

export default function ChatIput (props) {

// const handleKey = () => {
//     // props.setIsWriting(prevWriting => !prevWriting)
//     props.showisWriting();
// }

    return(
        <div>
            <input placeholder="name..." value={props.userData.username} name="username" onChange={props.handleForm}/>
            <input 
            placeholder="message..." 
            value={props.userData.mes} 
            name="mes" 
            onChange={props.handleForm} 
            onInput={props.showisWriting}
            />

            <button onClick={props.handleSend}>Send</button>
        </div>
    )
}