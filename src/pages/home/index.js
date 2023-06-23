import {
	messageRoute,
	allMessagesRoute,
	contactRoute,
} from "../../utils/apiRoutes";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChatInput, SignOut, Contacts, Welcome } from "../../components";
import { swearWords } from "../../utils/notifications";
import axios from "axios";
import "../../App.css";
import "../../index.css";
import io from "socket.io-client";
const socket = io.connect("http://localhost:8080");
// const socket = io.connect("https://socket-chat-node.onrender.com");

function Home() {
	const currentUserToken = JSON.parse(localStorage.getItem("jwtToken"));
	const [messageData, setMessageData] = useState({
		mes: "",
		gif: "",
		time: "",
	});
	const [chatHistory, setChatHistory] = useState([]);
	const [user, setUser] = useState("");
	const [selectedContact, setSelectedContact] = useState("");
	const goTo = useNavigate();

	// Mask abusive content
	const badWord = message => {
		let str = message;

		for (let word of swearWords) {
			let regexp = new RegExp(`${word}`, "g");
			let crossedOutWord = "";

			for (let i = 0; i < word.length; i++) {
				crossedOutWord += "x";
			}

			str = str.replace(regexp, crossedOutWord);
		}

		return str;
	};

	// Send messageData to Socket, API, chatHistory
	const sendMessage = async e => {
		e.preventDefault();
		const messageId = crypto.randomUUID();
		const cleanMessage = badWord(messageData.mes);

		if (messageData.mes !== "") {
			await socket.emit("send_message", {
				secondaryId: messageId,
				from: currentUserToken.user._id,
				to: selectedContact._id,
				message: cleanMessage,
				gif: messageData.gif,
				likeStatus: false,
				laughStatus: false,
				timeStamp: messageData.time,
			});

			setChatHistory(prevHistory => {
				return [
					...prevHistory,
					{
						messageId: messageId,
						fromSender: true,
						message: cleanMessage,
						gif: messageData.gif,
						likeStatus: false,
						laughStatus: false,
						timeStamp: messageData.time,
					},
				];
			});

			await axios.post(messageRoute, {
				secondaryId: messageId,
				from: currentUserToken.user._id,
				to: selectedContact._id,
				message: cleanMessage,
				gif: messageData.gif,
				likeStatus: false,
				laughStatus: false,
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

	/* eslint-disable react-hooks/exhaustive-deps */
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
	}, [selectedContact]);

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
				const updatedArr = chatHistory.map(msg => {
					return msg.messageId === data.messageId
						? {
								...msg,
								likeStatus: data.likeStatus,
								laughStatus: data.laughStatus,
						  }
						: msg;
				});

				setChatHistory(updatedArr);
			}
		});

		return () => {
			socket.off("receive_message");
		};
	}, [chatHistory]);
	/* eslint-enable react-hooks/exhaustive-deps */

	return (
		<>
			<h1 className='font-display font-semibold text-4xl tracking-wider uppercase text-white mt-[10vh] mb-[14vh]'>
				Pixel Chat
			</h1>
			<div className='relative w-[90%] max-w-4xl mx-auto'>
				{user._id && (
					<button
						className='absolute bottom-0 left-0 btn-secondary'
						onClick={() => goTo("/profile", { state: user })}
					>
						Go to Profile
					</button>
				)}
			</div>

			<div className='bg-stone-50 w-[90%] max-w-4xl mx-auto my-5 p-[2%] flex flex-wrap rounded-lg'>
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

				{selectedContact && (
					<div className='font-display text-xl font-semibold hidden md:block md:mb-2 md:flex md:items-center md:basis-full md:order-1 md:justify-end'>
						<p className='mx-1.5'> Chatting with {selectedContact.username}</p>
						{selectedContact.isAvatarImageSet && (
							<img
								className='w-7 h-7 bg-inherit'
								src={selectedContact.avatarImage}
								alt='avatar'
							/>
						)}
					</div>
				)}
			</div>
			<div className='relative w-[90%] max-w-4xl mx-auto mb-10 p-[4%]'>
				<SignOut socket={socket} currentUser={currentUserToken} />
			</div>
		</>
	);
}

export default Home;
