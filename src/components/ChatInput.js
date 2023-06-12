import axios from "axios";
import { React, useState, useEffect, useRef } from "react";

export default function ChatInput(props) {
	const { username, avatarImage, isAvatarImageSet } = props.contact;
	const [messagesLoaded, setMessagesLoaded] = useState(false);
	const messageEnd = useRef();
	const [gifArray, setGifArray] = useState([]);
	const [displayGifs, setdisplayGifs] = useState(false);
	const [selectedGif, setSelectedGif] = useState("");

	// Create Message
	const handleInput = e => {
		e.preventDefault();
		const { name, value } = e.target;
		const date = new Date();
		let minutes = date.getMinutes();
		if (minutes < 10) {
			minutes = minutes.toString().padStart(2, 0);
		}
		props.setUserData({
			...props.userData,
			time: `${date.getHours()} : ${minutes} `,
			[name]: value,
		});
	};

	// GIF Logic
	useEffect(() => {
		const getGifs = async () => {
			try {
				const res = await axios.get(
					"https://api.giphy.com/v1/gifs/trending?api_key=actNFVElp7HT7PpQ0FN8quC7zS8z8Jy0&limit=6"
				);
				console.log(res.data.data);
				setGifArray(res.data.data);
			} catch (err) {
				console.error(err);
			}
		};

		getGifs();
	}, []);

	const gifMenu = gifArray.map(gif => {
		return (
			<img
				key={gif.id}
				id={gif.id}
				src={gif.images.fixed_height_small.url}
				alt='GIF'
				onClick={e => sendGif(e)}
			/>
		);
	});

	const gifToggle = e => {
		e.preventDefault();
		setdisplayGifs(prevGifs => !prevGifs);
	};

	const sendGif = e => {
		let gifId = gifArray.filter(g => g.id === e.target.id )
		console.log(gifId[0].url)
		props.setUserData({
			...props.userData,
			gif: gifId[0].images.looping.mp4

		});
		// setSelectedGif(e.target.key)
	}

	// Display Message History
	const messagesFeed = props.messageHistory.map((obj, index) => {

		return (
			<div
				className={
					obj.fromSender
						? "container-chat-content-sent"
						: "container-chat-content-received"
				}
				key={index}
			>
				<span>{obj.timeStamp}</span>
				{obj.gif && <video controls>
						<source src={obj.gif}  type="video/mp4"/>
					 </video>}
				<p>{obj.message}</p>
			</div>
		);
	});

	useEffect(() => {
		messagesFeed.length ? setMessagesLoaded(true) : setMessagesLoaded(false);
		if (messagesLoaded) {
			messageEnd.current.scrollIntoView(false, { behavior: "smooth" });
		}
	}, [messagesFeed]);

	return (
		<div className='container-chat'>
			<div className='chat-header'>
				<p> Chatting with {username}</p>
				{isAvatarImageSet && (
					<img className='chat-avatar' src={avatarImage} alt='avatar' />
				)}
			</div>
			<div className='chat-body'>
				<div className='container-messages' ref={messageEnd}>
					{messagesLoaded ? (
						messagesFeed
					) : (
						<h2 className='heading-big'>Let's chat!</h2>
					)}
				</div>
			</div>

			<form className='chat-footer'>
				<input
					placeholder='message...'
					value={props.userData.mes}
					name='mes'
					onChange={handleInput}
				/>

				<div className='gif_dropdown'>
					<div className='gif_dropdown__content'>{displayGifs && gifMenu}</div>
					<button className='gif_dropdown__btn' onClick={gifToggle}>
						Gif
					</button>
				</div>

				<button onClick={props.handleSend}>Send</button>
			</form>
		</div>
	);
}
