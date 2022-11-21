import {useState, useEffect}  from 'react';
import './App.css';
import io from "socket.io-client";
import ChatIput from './components/ChatInput';
const socket = io.connect("http://localhost:5001");

function App() {


  const [messageData, setMessageData] = useState({
    mes: '', 
    roomNum : '' , 
    userName : '', 
    time: `${new Date(Date.now()).getHours()} : ${new Date(Date.now()).getMinutes()} `
  });
  // const [makingMessage, setMakingMessage] = useState(false);
  const [recievedMessage, setRecievedMessage] = useState("");


  console.log(messageData)


  
  const handleInput = (e) => {
    const {name, value} = e.target;
    // console.log(e.target.mes.value)
    // value.length? setMessage(({...message, writing : true})) : setMessage(({...message, writing : false}))
    setMessageData({
    ...messageData,
    [name] : value,
    })
    
    // showWriting()
    
  };

  // const showWriting = () => {
  //   socket.emit("show_writing", {message})
  
  // }

  const sendMessage = async () => {
    // setWriting(false)
    if (messageData.mes !== '') {

      await socket.emit("send_message", {messageData});
    }
  };

  const joinRoom = () => {
    messageData.roomNum? socket.emit("join_room", messageData.roomNum) : console.log('must give valid room name')
  };

  useEffect(() => {
    // socket.on("making_message", (data) => {
    //   data.message.mes? setMakingMessage(true) : setMakingMessage(false)
    //   // setMakingMessage(true)
    //   setName(data.message.username)
    // })

    socket.on("recieve_message", (data) => {
      // setMakingMessage(false)
      setRecievedMessage(data.messageData)
    })

    socket.on("disconnect_message", (data) => {
      setRecievedMessage(data)
    })

    return () => {
      // socket.off("making_message");
      socket.off("recieve_message");
      socket.off("disconnect_message");
    }


  }, [socket]);



  return (
    <div className="App">
      <div className="container-room-input">
        <input placeholder="room..." value={messageData.roomNum} name="roomNum" onChange={handleInput}/>
        <button onClick={joinRoom}>join room</button>
      </div>

      <br></br>

      <ChatIput 
      socket ={socket}
      userData={messageData}
      handleForm={handleInput}
      handleSend={sendMessage}
      recievedMessages={recievedMessage}
      // setIsWriting={setWriting}
      // showisWriting={showWriting}
      />

    </div>
  );
}

export default App;
