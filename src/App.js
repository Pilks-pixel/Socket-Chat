import {useState, useEffect}  from 'react';
import './App.css';
import io from "socket.io-client";
import ChatIput from './components/ChatInput';
const socket = io.connect("http://localhost:5001");

function App() {


  const [message, setMessage] = useState({mes: '', roomNum : '' , userName : ''});
  // const [makingMessage, setMakingMessage] = useState(false);
  const [recievedMessage, setRecievedMessage] = useState("");


  console.log(message)


  
  const handleInput = (e) => {
    const {name, value} = e.target;
    // console.log(e.target.mes.value)
    // value.length? setMessage(({...message, writing : true})) : setMessage(({...message, writing : false}))
    setMessage({
    ...message,
    [name] : value,
    })
    
    // showWriting()
    
  };

  // const showWriting = () => {
  //   socket.emit("show_writing", {message})
  
  // }

  const sendMessage = () => {
    // setWriting(false)
    socket.emit("send_message", {message})
  };

  const joinRoom = () => {
    message.roomNum? socket.emit("join_room", message.roomNum) : console.log('must give valid room name')
  };

  useEffect(() => {
    // socket.on("making_message", (data) => {
    //   data.message.mes? setMakingMessage(true) : setMakingMessage(false)
    //   // setMakingMessage(true)
    //   setName(data.message.username)
    // })

    socket.on("recieve_message", (data) => {
      // setMakingMessage(false)
      setRecievedMessage(data.message)
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
      <input placeholder="room..." value={message.roomNum} name="roomNum" onChange={handleInput}/>
      <button onClick={joinRoom}>join room</button>

      <br></br>

      <ChatIput 
      socket ={socket}
      userData={message}
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
