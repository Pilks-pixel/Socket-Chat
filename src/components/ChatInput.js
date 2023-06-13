import axios from "axios";
import { React, useState, useEffect, useRef } from "react";
import { randomInt } from "../utils/notifications";

export default function ChatInput(props) {
	const { username, avatarImage, isAvatarImageSet } = props.contact;
	const [messagesLoaded, setMessagesLoaded] = useState(false);
	const messageEnd = useRef();
	const [gifArray, setGifArray] = useState([]);
	const [displayGifs, setdisplayGifs] = useState(false);
	const [gifLoading, setGifLoading] = useState(false);
	const [gifData, setGifData] = useState([]);

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
					"https://api.giphy.com/v1/gifs/trending?api_key=actNFVElp7HT7PpQ0FN8quC7zS8z8Jy0&limit=21"
				);
				const gifsWithID = res.data.data.map(gifObject => {
					return {
						...gifObject,
						keyId: crypto.randomUUID(),
					};
				});

				setGifData(gifsWithID);
			} catch (err) {
				console.error(err);
			}
		};

		getGifs();
	}, []);

	useEffect(() => {
		if (gifData.length > 0) {
			setGifLoading(true);
			const randomGifs = [];

			function addGif() {
				let seed = gifData[randomInt(gifData.length)];
				console.log({ seed }, gifData);
				if (!randomGifs.includes(seed)) {
					return randomGifs.push(seed);
				} else {
					addGif();
				}
			}

			for (let i = 0; i < 6; i++) {
				addGif();
			}
			setGifArray(randomGifs);
			setGifLoading(false);
		}
	}, [displayGifs]);

	const gifMenu = gifArray.map(gif => {
		return (
			<img
				key={gif.keyId}
				id={gif.id}
				src={gif.images.fixed_height_small.url}
				alt='GIF'
				onClick={e => selectGif(e)}
			/>
		);
	});

	const gifToggle = e => {
		e.preventDefault();
		setdisplayGifs(prevGifs => !prevGifs);
	};

	const selectGif = e => {
		let gifId = gifArray.filter(g => g.id === e.target.id);
		console.log(gifId[0].url);
		props.setUserData({
			...props.userData,
			gif: gifId[0].images.looping.mp4,
		});
		setdisplayGifs(prevGifs => !prevGifs);
	};

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
				{obj.gif && (
					<video controls className='gif_image'>
						<source src={obj.gif} type='video/mp4' />
					</video>
				)}
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
