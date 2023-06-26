import React from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaGrinSquint } from "react-icons/fa";
import axios from "axios";
import { updateMessageRoute } from "../utils/apiRoutes";

export default function Emoji({
	id,
	likeEmoji,
	laughEmoji,
	socket,
	selectedContactId,
	UserToken,
	emojiHistory,
	setEmojiHistory,
	sender,
}) {
	// Like or Laugh on a post from another user
	const addEmoji = async e => {
		const emojiTarget = e.currentTarget.id;

		try {
			if (emojiTarget === "content__like") {
				likeEmoji = true;
			} else if (emojiTarget === "content__laugh") {
				laughEmoji = true;
			}

			await socket.emit("update_message", {
				from: UserToken.user._id,
				to: selectedContactId,
				messageId: id,
				likeStatus: likeEmoji,
				laughStatus: laughEmoji,
			});

			const updatedArr = emojiHistory.map(msg => {
				return msg.messageId === id
					? {
							...msg,
							likeStatus: likeEmoji,
							laughStatus: laughEmoji,
					  }
					: msg;
			});

			setEmojiHistory(updatedArr);

			await axios.put(`${updateMessageRoute}/${id}/update`, {
				likeStatus: likeEmoji,
				laughStatus: laughEmoji,
			});
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<>
			<div className='flex gap-1'>
				{(!sender || likeEmoji) && (
					<button
						aria-label='like message button'
						id='content__like'
						onClick={e => addEmoji(e)}
					>
						{likeEmoji ? (
							<AiFillHeart color='red' size={24} />
						) : (
							<AiOutlineHeart color='white' size={24} />
						)}
					</button>
				)}
				{(!sender || laughEmoji) && (
					<button
						aria-label='laugh message button'
						id='content__laugh'
						onClick={e => addEmoji(e)}
					>
						{laughEmoji ? (
							<FaGrinSquint color='yellow' size={24} />
						) : (
							<FaGrinSquint color='grey' size={24} />
						)}
					</button>
				)}
			</div>
		</>
	);
}
