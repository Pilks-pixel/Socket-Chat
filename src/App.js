import {useState, useEffect}  from 'react';
import './App.css';
import io from "socket.io-client";
import ChatIput from './components/ChatInput';
const socket = io.connect("http://localhost:5001");

function App() {


  const [name, setName] = useState("");
  const [message, setMessage] = useState({mes: '', roomNum : '' , username : ''});
  // const [writing, setWriting] = useState(false);
  const [makingMessage, setMakingMessage] = useState(false);
  const [recievedMessage, setRecievedMessage] = useState("");

  console.log(makingMessage)
  console.log(message)
  
  const handleInput = (e) => {
    const {name, value} = e.target;
    return setMessage({
    ...message,
    [name] : value
    })
  };

  const showWriting = () => {
    // setMakingMessage(true)
    socket.emit("show_writing", {message})
  
  }

  const sendMessage = () => {
    // setWriting(false)
    socket.emit("send_message", {message})
  };

  const joinRoom = () => {
    socket.emit("join_room", message.roomNum)
  };

  useEffect(() => {
    socket.on("making_message", (data) => {
      data.message.mes? setMakingMessage(true) : setMakingMessage(false)
      setName(data.message.username)
    })

    socket.on("recieve_message", (data) => {
      // setMakingMessage(false)
      setRecievedMessage(data.message.mes)
      setName(data.message.username)
    })

    socket.on("disconnect_message", (data) => {
      setRecievedMessage(data)
    })

    return () => {
      socket.off("making_message");
      socket.off("recieve_message");
      socket.off("disconnect_message");
    }


  }, [socket]);



  return (
    <div className="App">
      <input placeholder="room..." value={message.roomNum} name="roomNum" onChange={handleInput}/>
      <button onClick={joinRoom}>join room</button>

      <br></br>

      <ChatIput 
      userData={message}
      handleForm={handleInput}
      handleSend={sendMessage}
      // setIsWriting={setWriting}
      showisWriting={showWriting}
      />

      <br></br>
       <h1>{name}:{makingMessage? `${name} is writing ...`
       : recievedMessage? recievedMessage
       : ''} </h1> 

    </div>
  );
}

export default App;
