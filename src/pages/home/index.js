import {useState, useEffect}  from 'react';
import '../../App.css';
import ChatIput from '../../components/ChatInput';
import io from "socket.io-client";
const socket = io.connect("http://localhost:5001");


function Home() {
    const [messageData, setMessageData] = useState({
        mes: '', 
        roomNum : '' , 
        userName : '', 
        time : ''
      });
      const [chatHistory, setChatHistory] = useState([]);
      const [activeUser, setActiveUser] = useState([]);
      const [room, setRoom] = useState([]);
    
      
      const handleInput = (e) => {
      const {name, value} = e.target;
        setMessageData({
        ...messageData,
        time: `${new Date(Date.now()).getHours()} : ${new Date(Date.now()).getMinutes()} `,
        [name] : value,
        })
        
      };
    
      const sendMessage = async () => {
        if (messageData.mes !== '') {
    
          await socket.emit("send_message", messageData);
          setChatHistory(prevHistory => [...prevHistory, messageData]);
          setMessageData(prevMessageData => ({...prevMessageData, mes: ''}))
    
        }
      };
    
      const joinRoom = () => { 
    
        messageData.roomNum && room.some(rooms => rooms === messageData.roomNum) === false?
        socket.emit("join_room", messageData) :
        console.log('must give a valid and unique room name')
    
        setRoom(prevRoom => [...prevRoom, messageData.room])
    
      };

      useEffect(() => {

        socket.on("user_join_message", (data) => {
          setActiveUser(prevUsers => [...prevUsers, data.userName])
          console.log(activeUser, data)
    
        })
        
        socket.on("recieve_message", (data) => {
          setChatHistory(prevHistory => [...prevHistory, data])
          setActiveUser(prevUsers => [...prevUsers, data.userName])
    
    
        })
    
        socket.on("disconnect_message", (data) => {
          
        })
    
        return () => {
          socket.off("user_join_message");
          socket.off("recieve_message");
          socket.off("disconnect_message");
        }
    
      }, [socket]);
    
    
    
  return (
    <div className="home">

        <div className="container-room-input">
            <input placeholder="name..." value={messageData.userName} name="userName" onChange={handleInput}/>
            <input placeholder="room..." value={messageData.roomNum} name="roomNum" onChange={handleInput}/>
            <button onClick={joinRoom}>join room</button>
        </div>

        <br></br>
        <div>
            
            {activeUser.length > 0? <p>{activeUser[activeUser.length - 1]} has joined</p> : <p></p>}
        </div>

        <ChatIput 
        socket ={socket}
        userData={messageData}
        handleForm={handleInput}
        handleSend={sendMessage}
        messageHistory={chatHistory}
        users={activeUser}
        />

    </div>
  )
}

export default Home;