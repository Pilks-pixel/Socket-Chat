import axios from "axios";
import { React, useState, useEffect, useRef } from "react";
import { Emoji } from ".";
import { randomInt } from "../utils/notifications";
import { FaPaperPlane } from "react-icons/fa";

export default function ChatInput(props) {
	const { _id } = props.contact;
	const [messagesLoaded, setMessagesLoaded] = useState(false);
	const messageEnd = useRef();
	const [gifArray, setGifArray] = useState([]);
	const [displayGifs, setdisplayGifs] = useState(false);
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
					"https://api.giphy.com/v1/gifs/trending?api_key=actNFVElp7HT7PpQ0FN8quC7zS8z8Jy0&limit=20"
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

	/* eslint-disable react-hooks/exhaustive-deps */
	useEffect(() => {
		if (gifData.length > 0) {
			const randomGifs = [];

			function addGif() {
				let seed = gifData[randomInt(gifData.length)];

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
		}
	}, [displayGifs]);

	const gifMenu = gifArray.map(gif => {
		return (
			<img
				key={gif.keyId}
				id={gif.id}
				className='w-min rounded shadow-lg cursor-pointer'
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

		props.setUserData({
			...props.userData,
			gif: gifId[0].images.looping.mp4,
		});
		setdisplayGifs(prevGifs => !prevGifs);
	};

	// Display Message History & Emoji For Selected Contact
	const messagesFeed = props.messageHistory.map((obj, index) => {
		return (
			<div
				className={
					obj.fromSender
						? "  bg-glass min-width-custom p-1.5 mb-4 rounded-md self-end"
						: "  bg-glass min-width-custom p-1.5 mb-4 rounded-md self-start"
				}
				key={index}
			>
				<div className='flex justify-between mb-2'>
					<span>{obj.timeStamp}</span>

					{(!obj.fromSender || obj.likeStatus || obj.laughStatus) && (
						<Emoji
							id={obj.messageId}
							likeEmoji={obj.likeStatus}
							laughEmoji={obj.laughStatus}
							socket={props.socket}
							selectedContactId={_id}
							UserToken={props.token}
							emojiHistory={props.messageHistory}
							setEmojiHistory={props.setMessageHistory}
						/>
					)}
				</div>

				{obj.gif && (
					<video controls className=' max-w-[275px] mb-3'>
						<source src={obj.gif} type='video/mp4' />
					</video>
				)}
				<p className='mb-3'>{obj.message}</p>
			</div>
		);
	});

	useEffect(() => {
		messagesFeed.length ? setMessagesLoaded(true) : setMessagesLoaded(false);
		if (messagesLoaded) {
			messageEnd.current.scrollIntoView(false, { behavior: "smooth" });
		}
	}, [props.messageHistory]);
	/* eslint-enable react-hooks/exhaustive-deps */

	return (
		<div className='text-white bg-hero-pattern chat-feed order-2 relative h-[500px] flex flex-col justify-between overflow-auto'>
			<div className='pt-2 px-2 flex flex-col gap-2' ref={messageEnd}>
				{messagesLoaded ? (
					messagesFeed
				) : (
					<h2 className='font-display text-3xl font-semibold m-3'>
						Let's chat!
					</h2>
				)}
			</div>

			<form className=' text-black bg-white w-[70%] mb-2 p-2 rounded-md self-center flex gap-3 justify-end items-center transition-colors'>
				<input
					className='w-full rounded-md'
					placeholder='message...'
					value={props.userData.mes}
					name='mes'
					onChange={handleInput}
				/>

				<div className='self-end'>
					<button
						className={`font-extrabold uppercase tracking-wide p-1 border-2 rounded-full hover:bg-gray-200 hover:text-white ${
							props.userData.gif.length > 0 && "text-green-400 border-green-400"
						}`}
						onClick={gifToggle}
					>
						gif
					</button>
					<div className={`${!displayGifs && "hidden"} bg-gray-200 absolute inset-x-0 p-1.5 flex flex-wrap gap-2 place-content-center z-1 shadow-lg rounded-md opacity-90`}
					aria-expanded={displayGifs}
					>
						{displayGifs && gifMenu}
					</div>
				</div>

				{props.userData.mes && <button
					onClick={props.handleSend}
					className='bg-gray-500 p-2 border-2 rounded-full self-end hover:bg-gray-200'
					aria-label='send button'
				>
					<FaPaperPlane color='white' />
				</button>}
			</form>
		</div>
	);
}
