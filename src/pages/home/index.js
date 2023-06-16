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
		gif: "",
		time: "",
	});
	const [chatHistory, setChatHistory] = useState([]);
	const [currentUserToken, setCurrentUserToken] = useState(
		JSON.parse(localStorage.getItem("jwtToken"))
	);
	const [user, setUser] = useState("");
	const [selectedContact, setSelectedContact] = useState("");
	const goTo = useNavigate();

	// Send messageData to Socket & API
	const sendMessage = async e => {
		e.preventDefault();
		const messageId = crypto.randomUUID();

		if (messageData.mes !== "") {
			await socket.emit("send_message", {
				secondaryId: messageId,
				from: currentUserToken.user._id,
				to: selectedContact._id,
				message: messageData.mes,
				gif: messageData.gif,
				likeStatus : false,
				laughStatus : false,
				timeStamp: messageData.time,
			});

			setChatHistory(prevHistory => {
				return [
					...prevHistory,
					{
						messageId: messageId,
						fromSender: true,
						message: messageData.mes,
						gif: messageData.gif,
						likeStatus : false,
						laughStatus : false,
						timeStamp: messageData.time,
					},
				];
			});

			await axios.post(messageRoute, {
				secondaryId: messageId,
				from: currentUserToken.user._id,
				to: selectedContact._id,
				message: messageData.mes,
				gif: messageData.gif,
				likeStatus : false,
				laughStatus : false,
				timeStamp: messageData.time,
			});

			setMessageData(prevMessageData => ({
				...prevMessageData,
				mes: "",
				gif: "",
			}));
		}
	};

	// Get User & Contact with Message History
	const handleChatChange = contact => {
		setSelectedContact(contact);
	};

	useEffect(() => {
		socket.emit("add_user", currentUserToken.user._id);

		const getUser = async () => {
			const res = await axios.get(
				`${contactRoute}/${currentUserToken.user._id}`
			);
			setUser(res.data);
		};

		const getMessageHistory = async () => {
			const res = await axios.post(allMessagesRoute, {
				from: currentUserToken.user._id,
				to: selectedContact._id,
			});

			setChatHistory(res.data);
		};

		getUser();
		getMessageHistory();
	}, [selectedContact, currentUserToken]);

	// Socket event listener functionality
	useEffect(() => {
		socket.on("receive_message", data => {
			if (data.from === selectedContact._id) {
				setChatHistory(prevHistory => {
					return [
						...prevHistory,
						{
							messageId: data.secondaryId,
							fromSender: false,
							message: data.message,
							gif: data.gif,
							likeStatus: data.likeStatus,
							laughStatus: data.laughStatus,
							timeStamp: data.timeStamp,
						},
					];
				});
			}
		});

		socket.on("receive_message_update", data => {
			if (data.from === selectedContact._id) {
				console.log({ data }, "data from other user");

				const updatedArr = chatHistory.map(msg => {
					return msg.messageId === data.messageId
						? {
								...msg,
								likeStatus: data.likeStatus,
								laughStatus: data.laughStatus,
						  }
						: msg;
				});
				console.log(updatedArr, 'array update')
				setChatHistory(updatedArr);

			}
		});

		return () => {
			socket.off("receive_message");
		};
	}, [chatHistory]);

	return (
		<div className='home-page'>
			<div className='container-nav'>
				<h1 className='heading-big'>Pixel Chat</h1>
				<button
					className='links'
					onClick={() => goTo("/profile", { state: user })}
				>
					Profile
				</button>
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
						setUserData={setMessageData}
						handleSend={sendMessage}
						messageHistory={chatHistory}
						setMessageHistory={setChatHistory}
						contact={selectedContact}
						token={currentUserToken}
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
