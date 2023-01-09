import { React, useState, useEffect, useRef } from "react"

export default function ChatInput(props) {

    const { username, avatarImage, isAvatarImageSet } = props.contact;
    const [messagesLoaded, setMessagesLoaded] = useState(false);
    const messageEnd = useRef();



    const messagesFeed = props.messageHistory.map((obj, index) => {
        return <div className={
            obj.fromSender ?
            "container-chat-content-sent" :
            "container-chat-content-recieved"
        }
            key={index}
        >

            <span>{obj.timeStamp}</span>
            <p>{obj.message}</p>
        </div>
    });


    useEffect(() => {   

        messagesFeed.length ? setMessagesLoaded(true) : setMessagesLoaded(false);
        if (messagesLoaded) {
            messageEnd.current.scrollIntoView(false, { behavior: "smooth" });   
        }

    }, [messagesFeed])


    return (
        <div className="container-chat">
            <div className="chat-header">
                <p> Room : {props.userData.roomNum}</p>
                <h3>{username}</h3>
                {isAvatarImageSet && <img className='avatar' src={avatarImage} alt='avatar' />}

            </div>
            <div className="chat-body"  >
                <div className="messages-container" ref={messageEnd}>
                    {messagesLoaded ? messagesFeed : <h2>Let's chat!</h2>}

                </div>

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