import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ChatInput, SignOut, Contacts, Welcome } from "../../components";
import {
	messageRoute,
	allMessagesRoute,
	contactRoute,
} from "../../utils/apiRoutes";
import axios from "axios";
import "../../App.css";
import io from "socket.io-client";
const socket = io.connect("http://localhost:8080");
// const socket = io.connect("https://socket-chat-node.onrender.com");

function Home() {
	const [messageData, setMessageData] = useState({
		mes: "",
		time: "",
	});
	const [chatHistory, setChatHistory] = useState([]);
	const [currentUserToken, setCurrentUserToken] = useState(
		JSON.parse(localStorage.getItem("jwtToken"))
	);
	const [user, setUser] = useState("");
	const [selectedContact, setSelectedContact] = useState("");
	const goTo = useNavigate();

	// messageData handler functions
	const handleInput = e => {
		const { name, value } = e.target;
		const date = new Date();
		let minutes = date.getMinutes();
		if (minutes < 10) {
			minutes = minutes.toString().padStart(2, 0);
		}
		setMessageData({
			...messageData,
			time: `${date.getHours()} : ${minutes} `,
			[name]: value,
		});
	};

	const sendMessage = async () => {
		if (messageData.mes !== "") {
			await socket.emit("send_message", {
				from: currentUserToken.user._id,
				to: selectedContact._id,
				message: messageData.mes,
				timeStamp: messageData.time,
			});

			setChatHistory(prevHistory => {
				return [
					...prevHistory,
					{
						fromSender: true,
						message: messageData.mes,
						timeStamp: messageData.time,
					},
				];
			});

			await axios.post(messageRoute, {
				from: currentUserToken.user._id,
				to: selectedContact._id,
				message: messageData.mes,
				timeStamp: messageData.time,
			});
			// console.log(messageData);

			setMessageData(prevMessageData => ({ ...prevMessageData, mes: "" }));
		}
	};

	// User & Contact functionality
	const handleChatChange = contact => {
		setSelectedContact(contact);
	};

	useEffect(() => {
		socket.emit("add_user", currentUserToken.user._id);

		const getUser = async () => {
			const res = await axios.get(
				`${contactRoute}/${currentUserToken.user._id}`
			);
			console.log(res.data);
			setUser(res.data);
		};

		getUser();
	}, [selectedContact, currentUserToken]);

	useEffect(() => {
		async function getMessageHistory() {
			const res = await axios.post(allMessagesRoute, {
				from: currentUserToken.user._id,
				to: selectedContact._id,
			});

			setChatHistory(res.data);
		}

		getMessageHistory();
	}, [selectedContact]);

	// Socket event listener functionality
	useEffect(() => {
		socket.on("receive_message", data => {
			if (data.from === selectedContact._id) {
				setChatHistory(prevHistory => {
					return [
						...prevHistory,
						{
							fromSender: false,
							message: data.message,
							timeStamp: data.timeStamp,
						},
					];
				});
			}
		});

		return () => {
			socket.off("receive_message");
		};
	}, [socket]);

	return (
		<div className='home-page'>
			<div className='container-nav'>
				<h1 className='heading-big'>Pixel Chat</h1>
				<button className='links' onClick={() => goTo("/profile", {state: user})}>Profile</button>
			</div>
			<div className='container-home-feed'>
				<Contacts
					showContact={handleChatChange}
					contact={selectedContact}
					currentUser={user}
					token={currentUserToken}
				/>

				{selectedContact ? (
					<ChatInput
						socket={socket}
						userData={messageData}
						handleForm={handleInput}
						handleSend={sendMessage}
						messageHistory={chatHistory}
						contact={selectedContact}
					/>
				) : (
					<Welcome currentUser={currentUserToken} />
				)}
			</div>
			<div className='container-footer'>
				<SignOut socket={socket} currentUser={currentUserToken} />
			</div>
		</div>
	);
}

export default Home;
