import { useState, useEffect } from 'react';
import '../../App.css';
import ChatIput from '../../components/ChatInput';
import { SignOut } from '../../components/SignOut';
import Contacts from '../../components/Contacts';
import Welcome from '../../components/Welcome';
import axios from 'axios';
import { messageRoute, allMessagesRoute } from '../../utils/apiRoutes';
import io from "socket.io-client";
const socket = io.connect("http://localhost:5000");


function Home() {
  const [messageData, setMessageData] = useState({
    mes: '',
    time: ''
  });
  const [chatHistory, setChatHistory] = useState([]);
  const [currentUserToken, setCurrentUserToken] = useState(JSON.parse(localStorage.getItem('jwtToken')));
  const [selectedContact, setSelectedContact] = useState('');



  // messageData handler functions
  const handleInput = (e) => {
    const { name, value } = e.target;
    setMessageData({
      ...messageData,
      time: `${new Date(Date.now()).getHours()} : ${new Date(Date.now()).getMinutes()} `,
      [name]: value,
    })

  };

  const sendMessage = async () => {
    if (messageData.mes !== '') {

      await socket.emit("send_message", {
        from: currentUserToken.user._id,
        to: selectedContact._id,
        message: messageData.mes,
        timeStamp: messageData.time

      });

      setChatHistory(prevHistory => {
        return [
          ...prevHistory,
           { fromSender: true, message: messageData.mes, timeStamp: messageData.time }
          ]
      })

      await axios.post(messageRoute, {
        from: currentUserToken.user._id,
        to: selectedContact._id,
        message: messageData.mes,
        timeStamp: messageData.time

      })
      // console.log(messageData);

      setMessageData(prevMessageData => ({ ...prevMessageData, mes: '' }))
    }
  };


  // Contact functionality
  const handleChatChange = (contact) => {
    setSelectedContact(contact);
  };

  useEffect(() => {
    socket.emit('add_user', currentUserToken.user._id)
  }, [selectedContact, currentUserToken])


  useEffect(() => {

    async function getMessageHistory() {
      const res = await axios.post(allMessagesRoute, {
        from: currentUserToken.user._id,
        to: selectedContact._id,
      })

      setChatHistory(res.data);

    }

    getMessageHistory();
  }, [selectedContact]);


  // Socket event listener functionality 
  useEffect(() => {

    socket.on("recieve_message", (data) => {
      setChatHistory(prevHistory => {
        return [
          ...prevHistory,
           { fromSender: false, message: data.message, timeStamp: data.timeStamp }
          ]
      })

    })

    return () => {
      socket.off("recieve_message");
    }

  }, [socket]);



  return (
    <div className="home">

      {selectedContact ?
        <ChatIput
          socket={socket}
          userData={messageData}
          handleForm={handleInput}
          handleSend={sendMessage}
          messageHistory={chatHistory}
          contact={selectedContact}
          currentUser={currentUserToken}

        /> :

        <Welcome currentUser={currentUserToken} />
      }

      <SignOut />

      <Contacts
        showContact={handleChatChange}
        contact={selectedContact}
        currentUser={currentUserToken}
      />

    </div>
  )
}

export default Home;