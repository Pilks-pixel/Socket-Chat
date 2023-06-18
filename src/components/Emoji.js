import React from "react";
import { useState, useEffect } from "react";
import { TiPlus } from "react-icons/ti";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { FaGrinSquint } from "react-icons/fa";
import axios from "axios";
import { updateMessageRoute } from "../utils/apiRoutes";

export default function Emoji({ id, likeEmoji, laughEmoji, socket, selectedContactId, UserToken, emojiHistory, setEmojiHistory }) {
	const [likeClicked, setLikeClicked] = useState(likeEmoji);
	const [laughClicked, setLaughClicked] = useState(laughEmoji);


	const addEmoji = async (e) => {
		const firstWord = e.currentTarget.className.split(" ")[0];
        
		if (firstWord === "content__like") {
            likeEmoji = true;

		} else if (firstWord === "content__laugh") {
            laughEmoji = true

		}

        await socket.emit("update_message", {
            from: UserToken.user._id,
			to: selectedContactId,
            messageId: id,
            likeStatus: likeEmoji,
            laughStatus: laughEmoji
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

		try {
			const res = await axios.put(`${updateMessageRoute}/${id}/update`, {
				likeStatus: likeEmoji,
				laughStatus: laughEmoji
			});

		} catch (err) {
			console.error(err);
		}
	};

	return (
		<>
			<div className='container_chat__emojis_dropdown'>
				
					<div className='emojis_dropdown__content'>
						<button
							aria-label='like message button'
							className='content__like btn--emoji'
							onClick={e => addEmoji(e)}
						>
							{likeEmoji ? <AiFillHeart color='red' size={24} />
							: <AiOutlineHeart color='white' size={24} />}
						</button>
						<button
							aria-label='laugh message button'
							className='content__laugh btn--emoji'
							onClick={e => addEmoji(e)}
						>
							{laughEmoji? <FaGrinSquint color='yellow' size={24} />
							: <FaGrinSquint color='grey' size={24} />}
						</button>
					</div>
			
			</div>
		</>
	);
}
